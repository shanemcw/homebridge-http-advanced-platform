import { Coordinator } from './coordinator.js';
import { ActionError } from './types.js';

interface Work {
  run: (deadline: number, reservation: object) => Promise<void>;
  cancel: () => void;
}
interface Submission {
  owner: string;
  action: string;
  command: boolean;
  delay: number;
  timeout: number;
  prepare: (order: number) => Work;
}
interface Slot extends Work {
  action: string;
  command: boolean;
  delayed: boolean;
  readyAt: number;
  deadline: number;
  reservation: object;
  resolve: () => void;
  reject: (error: unknown) => void;
  readyTimer?: NodeJS.Timeout;
  expiryTimer?: NodeJS.Timeout;
  settled: boolean;
}
interface Lane { pending: Slot[]; active?: Slot }

// one bounded write queue per opted-in device; network admission remains shared
export class DeviceWrites {
  private readonly lanes = new Map<string, Lane>();
  private order = 0;
  private stopped = false;
  readonly stats = { received: 0, completed: 0, failed: 0, expired: 0, cancelled: 0, rejected: 0 };

  constructor(private readonly coordinator: Coordinator,
    private readonly report: (owner: string, action: string, command: boolean, error: unknown) => void) {}

  submit(request: Submission): Promise<void> | undefined {
    if (this.stopped) throw new ActionError('aborted');
    const lane = this.lanes.get(request.owner) ?? { pending: [] };
    const tail = lane.pending.at(-1);
    const now = Date.now();
    const delayed = !request.command && request.delay > 0;
    const replace = delayed && tail && !tail.command && tail.action === request.action && now < tail.readyAt;
    let reservation: object;
    try { reservation = replace ? tail.reservation : this.coordinator.reserve(); }
    catch (error) { if (request.command) this.stats.rejected++; throw error; }
    let work: Work;
    try { work = request.prepare(++this.order); }
    catch (error) { if (!replace) this.coordinator.release(reservation); throw error; }
    const readyAt = now + (delayed ? request.delay : 0);
    if (replace) {
      Object.assign(tail, work, { readyAt, deadline: readyAt + request.timeout });
      this.arm(request.owner, lane, tail);
      return;
    }
    let resolve: () => void = () => {};
    let reject: (error: unknown) => void = error => this.report(request.owner, request.action, false, error);
    const completion = delayed ? undefined : new Promise<void>((done, fail) => { resolve = done; reject = fail; });
    const slot: Slot = { ...work, action: request.action, command: request.command, delayed, readyAt,
      deadline: readyAt + request.timeout, reservation, resolve, reject, settled: false };
    lane.pending.push(slot);
    this.lanes.set(request.owner, lane);
    if (request.command) this.stats.received++;
    this.arm(request.owner, lane, slot);
    queueMicrotask(() => this.pump(request.owner, lane));
    return completion;
  }

  private clearTimers(slot: Slot): void { clearTimeout(slot.readyTimer); clearTimeout(slot.expiryTimer); }

  private arm(owner: string, lane: Lane, slot: Slot): void {
    this.clearTimers(slot);
    if (Date.now() < slot.readyAt) slot.readyTimer = setTimeout(() => {
      if (Date.now() < slot.readyAt) this.arm(owner, lane, slot);
      else this.pump(owner, lane);
    }, Math.min(slot.readyAt - Date.now(), 2147483647));
    slot.expiryTimer = setTimeout(() => {
      if (Date.now() < slot.deadline) { this.arm(owner, lane, slot); return; }
      const index = lane.pending.indexOf(slot);
      if (index < 0) return;
      lane.pending.splice(index, 1);
      this.fail(slot, new ActionError('timeout'), 'expired');
      this.pump(owner, lane);
    }, Math.max(0, Math.min(slot.deadline - Date.now(), 2147483647)));
  }

  private fail(slot: Slot, error: unknown, kind: 'failed' | 'expired' | 'cancelled'): void {
    if (slot.settled) return;
    slot.settled = true;
    this.clearTimers(slot);
    this.coordinator.release(slot.reservation);
    if (slot.command) this.stats[kind]++;
    slot.cancel();
    slot.reject(error);
  }

  private pump(owner: string, lane: Lane): void {
    if (this.stopped || this.lanes.get(owner) !== lane || lane.active) return;
    while (lane.pending[0] && Date.now() >= lane.pending[0].deadline) {
      this.fail(lane.pending.shift()!, new ActionError('timeout'), 'expired');
    }
    const slot = lane.pending[0];
    if (!slot) { this.lanes.delete(owner); return; }
    if (Date.now() < slot.readyAt) return;
    lane.pending.shift();
    lane.active = slot;
    this.clearTimers(slot);
    void Promise.resolve().then(() => {
      if (this.stopped) throw new ActionError('aborted');
      if (Date.now() >= slot.deadline) throw new ActionError('timeout');
      return slot.run(slot.deadline, slot.reservation);
    }).then(() => {
      if (slot.settled) return;
      slot.settled = true;
      if (slot.command) this.stats.completed++;
      slot.resolve();
    }, error => {
      if (slot.settled) return;
      // expiry in network admission has not attempted delivery or invalidated its followers
      if (error instanceof ActionError && (error.category === 'queue' || error.category === 'timeout' && !error.dispatched)) {
        this.fail(slot, error, error.category === 'timeout' ? 'expired' : 'failed');
        return;
      }
      // settle the waiting batch before callbacks can submit new explicit intent
      const cancelled = lane.pending.splice(0);
      this.fail(slot, error, 'failed');
      for (const waiting of cancelled) this.fail(waiting, new ActionError('cancelled'), 'cancelled');
      if (!slot.delayed) this.report(owner, slot.action, slot.command, error);
    }).finally(() => {
      this.coordinator.release(slot.reservation);
      lane.active = undefined;
      if (!this.stopped) this.pump(owner, lane);
    });
  }

  get pending(): number { return [...this.lanes.values()].reduce((sum, lane) => sum + lane.pending.length, 0); }

  shutdown(): void {
    this.stopped = true;
    for (const lane of this.lanes.values()) {
      for (const slot of lane.pending.splice(0)) this.fail(slot, new ActionError('aborted'), 'cancelled');
      if (lane.active) this.fail(lane.active, new ActionError('aborted'), 'cancelled');
    }
    this.lanes.clear();
  }
}

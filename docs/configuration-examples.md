# Configuration examples

These examples teach the current configuration model with generic HTTP endpoints rather than device-specific APIs. Adapt URLs, response shapes, authentication, mappings, and timing to the device you actually control.

The examples use `HttpAdvancedAccessory` blocks because they are compact and remain fully supported. The same device fields also work inside an `HttpAdvanced` platform `devices[]` entry: remove `"accessory": "HttpAdvancedAccessory"`, add a permanent `"id"`, and place the object in the platform's `devices` array. Do not define the same physical device both ways.

When `mappers` is present, it is an ordered array. The output of one mapper becomes the input of the next. Use [`lookup`](modernization.md#mappers) when the accepted input vocabulary is exact, and retain legacy `static` when pass-through behavior is intentional.

> **Refresh behavior:** Alpha serves getter values from shared cached state while HTTP acquisition runs in the background. A positive `forceRefreshDelay` keeps that device's explicit normal polling interval. `forceRefreshDelay: 0` uses the shared active/idle refresh schedule; unlike 1.3.0, it no longer means "fetch only when HomeKit asks." See [how reads and freshness work](modernization.md#how-reads-and-freshness-work).

## 1. Read a value from JSON

Suppose a temperature endpoint returns:

```json
{
  "temperature": 22.4
}
```

A minimal read-only sensor can extract that value with JSONPath:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "service": "TemperatureSensor",
  "name": "Patio Temperature",
  "forceRefreshDelay": 30,
  "urls": {
    "getCurrentTemperature": {
      "url": "http://sensor.local/status",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "jpath",
          "parameters": {
            "jpath": "$.temperature"
          }
        }
      ]
    }
  }
}
```

`requireResponseMatch` is optional. Here it prevents a missing JSONPath selection from being converted into an accidental characteristic value. A failed acquisition leaves the last usable cached state in place unless you explicitly configure `resultOnError`.

## 2. Translate an exact device vocabulary

Suppose a fan reports:

```json
{
  "power": "on"
}
```

and accepts a JSON POST body containing `"on"` or `"off"`. Chain JSONPath with `lookup` on the getter, then map the outgoing HomeKit boolean before `{value}` is substituted into the setter body:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "service": "Switch",
  "name": "Desk Fan",
  "urls": {
    "getOn": {
      "url": "http://fan.local/status",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "jpath",
          "parameters": {
            "jpath": "$.power"
          }
        },
        {
          "type": "lookup",
          "parameters": {
            "mapping": {
              "on": true,
              "off": false
            }
          }
        }
      ]
    },
    "setOn": {
      "url": "http://fan.local/power",
      "httpMethod": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": "{\"power\":\"{value}\"}",
      "mappers": [
        {
          "type": "lookup",
          "parameters": {
            "mapping": {
              "true": "on",
              "false": "off"
            }
          }
        }
      ]
    }
  }
}
```

An unknown getter value becomes inconclusive instead of silently passing through. An unknown setter value fails before the HTTP request is sent.

## 3. Give a sensor its own refresh interval

A sensor whose state changes outside HomeKit may benefit from an explicit interval. Suppose an occupancy endpoint returns `0` or `1`:

```json
{
  "occupied": 1
}
```

This device asks for a normal refresh every five seconds:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "service": "OccupancySensor",
  "name": "Office Presence",
  "forceRefreshDelay": 5,
  "urls": {
    "getOccupancyDetected": {
      "url": "http://presence-sensor.local/readings",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "jpath",
          "parameters": {
            "jpath": "$.occupied"
          }
        }
      ]
    }
  }
}
```

Use an interval appropriate to the server and the freshness you actually need. Fleet-wide concurrency, per-origin spacing, recovery backoff, and queue pressure can make real acquisition later than the nominal interval.

## 4. Add an optional characteristic and scale its range

Suppose a light reports brightness from `0` to `255`, while HomeKit Brightness uses `0` to `100`. Add the optional `Brightness` characteristic and scale in both directions:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "service": "Lightbulb",
  "name": "Desk Light",
  "optionCharacteristic": [
    "Brightness"
  ],
  "urls": {
    "getOn": {
      "url": "http://light.local/power"
    },
    "setOn": {
      "url": "http://light.local/power/{value}"
    },
    "getBrightness": {
      "url": "http://light.local/level",
      "mappers": [
        {
          "type": "scale",
          "parameters": {
            "inputMin": 0,
            "inputMax": 255,
            "outputMin": 0,
            "outputMax": 100,
            "round": 0,
            "clamp": true
          }
        }
      ]
    },
    "setBrightness": {
      "url": "http://light.local/level",
      "httpMethod": "POST",
      "body": "{value}",
      "mappers": [
        {
          "type": "scale",
          "parameters": {
            "inputMin": 0,
            "inputMax": 100,
            "outputMin": 0,
            "outputMax": 255,
            "round": 0,
            "clamp": true
          }
        }
      ]
    }
  }
}
```

`scale` is useful when the relationship is numeric and linear. Use `lookup` or another mapper when device values are symbolic or irregular.

## 5. Coordinate related characteristics

A garage door exposes separate current and target states. If one endpoint returns both:

```json
{
  "currentState": 1,
  "targetState": 1
}
```

the two getters can read the same endpoint and select different fields:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "service": "GarageDoorOpener",
  "name": "Garage Door",
  "forceRefreshDelay": 5,
  "urls": {
    "getCurrentDoorState": {
      "url": "http://garage.local/status",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "jpath",
          "parameters": {
            "jpath": "$.currentState"
          }
        }
      ]
    },
    "getTargetDoorState": {
      "url": "http://garage.local/status",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "jpath",
          "parameters": {
            "jpath": "$.targetState"
          }
        }
      ]
    },
    "setTargetDoorState": {
      "url": "http://garage.local/door/{value}",
      "mappers": [
        {
          "type": "lookup",
          "parameters": {
            "mapping": {
              "0": "open",
              "1": "close"
            }
          }
        }
      ]
    }
  }
}
```

This example deliberately maps the setter instead of embedding JavaScript in the URL. Legacy template expressions remain supported, but declarative mappings are easier to validate and maintain when a direct mapping is sufficient.

## 6. Fall back when the first response is inconclusive

Some APIs need more than one request to determine state. Suppose an alarm endpoint returns `DISARMED`, `ALARM`, or the generic state `ARMED`:

```xml
<status>
  <state>ARMED</state>
</status>
```

When the first endpoint says only `ARMED`, a second endpoint can identify `STAY`, `AWAY`, or `NIGHT`:

```json
{
  "accessory": "HttpAdvancedAccessory",
  "service": "SecuritySystem",
  "name": "Alarm System",
  "forceRefreshDelay": 10,
  "urls": {
    "getSecuritySystemCurrentState": {
      "url": "http://alarm.local/status.xml",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "xpath",
          "parameters": {
            "xpath": "//state/text()"
          }
        },
        {
          "type": "lookup",
          "parameters": {
            "mapping": {
              "DISARMED": 3,
              "ALARM": 4,
              "ARMED": "inconclusive"
            }
          }
        }
      ],
      "inconclusive": {
        "url": "http://alarm.local/mode.xml",
        "requireResponseMatch": true,
        "mappers": [
          {
            "type": "xpath",
            "parameters": {
              "xpath": "//mode/text()"
            }
          },
          {
            "type": "lookup",
            "parameters": {
              "mapping": {
                "STAY": 0,
                "AWAY": 1,
                "NIGHT": 2
              }
            }
          }
        ]
      }
    },
    "getSecuritySystemTargetState": {
      "url": "http://alarm.local/mode.xml",
      "requireResponseMatch": true,
      "mappers": [
        {
          "type": "xpath",
          "parameters": {
            "xpath": "//mode/text()"
          }
        },
        {
          "type": "lookup",
          "parameters": {
            "mapping": {
              "STAY": 0,
              "AWAY": 1,
              "NIGHT": 2,
              "DISARMED": 3
            }
          }
        }
      ]
    },
    "setSecuritySystemTargetState": {
      "url": "http://alarm.local/set-mode/{value}",
      "mappers": [
        {
          "type": "lookup",
          "parameters": {
            "mapping": {
              "0": "STAY",
              "1": "AWAY",
              "2": "NIGHT",
              "3": "DISARMED"
            }
          }
        }
      ]
    }
  }
}
```

The fallback is another getter action, so it can have its own URL, response checks, and mapper chain. A mapped result of `"inconclusive"` invokes it; transport failures instead follow normal error and recovery behavior.

## Use the same device as a platform entry

For a new platform-managed device, the configuration inside `devices[]` uses the same service, action, mapper, timing, and authentication fields. Give it a stable `id` and omit the accessory alias:

```json
{
  "platform": "HttpAdvanced",
  "name": "HTTP Advanced",
  "enabled": true,
  "devices": [
    {
      "id": "patio-temperature",
      "name": "Patio Temperature",
      "service": "TemperatureSensor",
      "forceRefreshDelay": 30,
      "urls": {
        "getCurrentTemperature": {
          "url": "http://sensor.local/status",
          "requireResponseMatch": true,
          "mappers": [
            {
              "type": "jpath",
              "parameters": {
                "jpath": "$.temperature"
              }
            }
          ]
        }
      }
    }
  ]
}
```

Choose the `id` before pairing and keep it stable. Moving an existing legacy accessory into a platform is a deliberate identity change, not an automatic migration; see the [migration guide](migration.md).

## More references

- The root [README](../README.md) covers installation, platform coexistence, Alpha.9 `lookup`/`scale`, additional services, shared settings, and troubleshooting.
- The [modernization reference](modernization.md) documents action semantics, caching, scheduling, response guards, mapper behavior, and release policy.
- The [service support table](service-support.md) lists services available for the supported Homebridge/HAP versions.
- The [legacy reference](legacy-reference.md) retains historical 1.3.0 behavior and real-device examples such as Bticino, Daikin, Yamaha MusicCast, and a generic multi-characteristic light.

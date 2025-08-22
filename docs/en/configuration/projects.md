# 📱 Projects

This guide shows you how to configure different types of projects in **playwright-io**: global configuration, specific project configuration, and parallel execution.

---

## 🚀 Global Configuration (use)

Default configuration that applies to all tests:

```ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
    testDir: './tests',
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 1,
    use: {
        // Default configuration for all projects
        capabilities: {
            platformName: 'Android',
            "appium:automationName": "UiAutomator2",
            "appium:udid": "YOUR_DEVICE_ID",
            "appium:appPackage": "com.example.app",
            "appium:appActivity": ".MainActivity"
        }
    }
});
```

## 📱 Project-Specific Configuration

For device or platform-specific configurations:

```ts
export default defineConfig<TestOptions>({
    testDir: './tests',
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 1,
    projects: [
        {
            name: 'Android App',
            use: {
                capabilities: {
                    platformName: 'Android',
                    "appium:udid": "DEVICE_ID_1",
                    "appium:appPackage": "com.example.app",
                    "appium:appActivity": ".MainActivity"
                }
            }
        },
        {
            name: 'iOS App',
            use: {
                capabilities: {
                    platformName: 'iOS',
                    "appium:udid": "DEVICE_ID_2",
                    "appium:bundleId": "com.example.app"
                }
            }
        }
    ]
});
```

> **💡 Note:** `workers: 1` is set so tests run sequentially per project, avoiding conflicts between devices.

---

## ⚡ Parallel Execution

To run tests in parallel on multiple devices:

```ts
export default defineConfig<TestOptions>({
    testDir: './tests',
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 3, // Number of parallel workers
    fullyParallel: true, // Run in full parallel
    
    projects: [
        {
            name: 'Android Device 1',
            use: {
                capabilities: {
                    platformName: 'Android',
                    "appium:udid": "emulator-5554",
                    "appium:appPackage": "com.example.app",
                    "appium:appActivity": ".MainActivity"
                }
            }
        },
        {
            name: 'Android Device 2',
            use: {
                capabilities: {
                    platformName: 'Android',
                    "appium:udid": "emulator-5556",
                    "appium:appPackage": "com.example.app",
                    "appium:appActivity": ".MainActivity"
                }
            }
        },
        {
            name: 'iOS Device 1',
            use: {
                capabilities: {
                    platformName: 'iOS',
                    "appium:udid": "SIMULATOR_ID",
                    "appium:bundleId": "com.example.app"
                }
            }
        }
    ]
});
```

> **⚠️ Important for parallel execution:**
> - `workers` = maximum number of devices running simultaneously
> - `fullyParallel: true` allows all tests to run in parallel

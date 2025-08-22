# 🔧 Options

This guide details the **playwright-io** specific options available in your `playwright.config.ts` file.

---

### config

- **Type:** `Partial<IOConfig>`
- **Default:** `undefined`
- **Description:** Native WebDriverIO configuration (hostname, port, timeouts, retries)

```ts
use: {
    config: {
        hostname: 'localhost',
        port: 4723,
        logLevel: 'silent',
        waitforTimeout: 30000,
        connectionRetryTimeout: 120000,
        connectionRetryCount: 3
    }
}
```

> **💡 Note:** If not specified, WebDriverIO default values are used.

> **📖 More options:** To see all available WebDriverIO configuration options, check: [https://webdriver.io/docs/configuration](https://webdriver.io/docs/configuration)

> **⚠️ Limitations:** Some WebDriverIO options are limited or disabled to avoid conflicts with Playwright:
> - **Test Runner Options**: `specs`, `exclude`, `suites`, `capabilities`, etc.
> - **Lifecycle Hooks**: `before*`, `after*`, `on*` (use Playwright hooks instead)
> - **Framework Options**: `mochaOpts`, `jasmineOpts`, `cucumberOpts`

### capabilities

- **Type:** `IOCapabilities`
- **Default:** Required
- **Description:** Appium capabilities that define device characteristics and automation configuration

```ts
use: {
    capabilities: {
        platformName: 'Android',
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": "My Device",
        "appium:udid": "DEVICE_ID",
        "appium:appPackage": "com.example.app",
        "appium:appActivity": ".MainActivity"
    }
}
```

> **⚠️ Required:** Capabilities are mandatory to establish connection with the device.

### takeScreenshot

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Take automatic screenshots during mobile test execution

```ts
use: {
    takeScreenshot: true,
    screenshot: 'off', // ⚠️ Required: disable for mobile
    // Or simply don't declare screenshot
}
```

> **⚠️ Important:** For mobile devices, Playwright `screenshot` must be disabled (`'off'`) or not declared.

### recordingScreen

- **Type:** `boolean | RecorderOptions`
- **Default:** `false`
- **Description:** Record screen during mobile test execution

```ts
use: {
    // Simple boolean configuration
    recordingScreen: true,
    
    // Configuration with options
    recordingScreen: {
        videoType: 'mp4',
        quality: 'medium', 
        maxDuration: 300
    },
    video: 'off', // ⚠️ Required: disable for mobile
}
```

#### videoType
- **`mp4`** - Standard video format (recommended)
- **`webm`** - Web video format

#### quality
- **`low`** - Low quality (smaller file size)
- **`medium`** - Medium quality (balance between size and quality)
- **`high`** - High quality (larger file size)
- **`lossless`** - No quality loss (maximum size)
- **`string | number`** - Custom value (e.g.: '720p', 1080)

#### maxDuration
- **Type:** `number`
- **Unit:** Seconds
- **Description:** Maximum recording duration per test
- **Recommended:** 300 seconds (5 minutes)

> **⚠️ Important:** For mobile devices, Playwright `video` must be disabled (`'off'`) or not declared.

### trace

- **Type:** `'on' | 'off' | 'retain-on-failure'`
- **Default:** `'off'`
- **Description:** Uses Playwright's native trace system (mobile compatible)

```ts
use: {
    trace: 'retain-on-failure' // ✅ Compatible with mobile devices
}
```

> **✅ Compatible:** Playwright traces work perfectly with mobile devices.

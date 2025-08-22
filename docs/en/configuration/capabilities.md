
# Appium Capabilities

**Capabilities** are configurations that define the characteristics of the device and application we want to automate. They are **mandatory** to establish connection with the device.

> **📱 Getting data:** To obtain the correct values for UDID, appPackage, bundleId, etc., check the [**Device Inspection**](en/prerequisites/device.md) guide.

---

## 🤖 Android Capabilities

### Essential Capabilities

```ts
capabilities: {
    platformName: 'Android',
    "appium:automationName": "UiAutomator2",        // Automation driver
    "appium:deviceName": "My Android Device",       // Descriptive name
    "appium:udid": "DEVICE_ID_HERE",                // Unique device ID
    "appium:appPackage": "com.example.app",         // Application package
    "appium:appActivity": ".MainActivity"           // Main activity
}
```

### Optional Capabilities

```ts
capabilities: {
    // ... essential capabilities
    "appium:platformVersion": "13.0",               // Android version
    "appium:noReset": true,                         // Don't reset app between tests
    "appium:fullReset": false,                      // Don't reinstall the app
    "appium:autoGrantPermissions": true,            // Grant permissions automatically
    "appium:unicodeKeyboard": true,                 // Enable Unicode keyboard
    "appium:resetKeyboard": true                    // Hide keyboard after test
}
```

---

## 🍎 iOS Capabilities

### Essential Capabilities

```ts
capabilities: {
    platformName: 'iOS',
    "appium:automationName": "XCUITest",            // Automation driver
    "appium:deviceName": "iPhone 15 Pro",          // Descriptive name
    "appium:udid": "SIMULATOR_OR_DEVICE_ID",       // Unique device/simulator ID
    "appium:bundleId": "com.example.app"           // Application bundle ID
}
```

### Optional Capabilities

```ts
capabilities: {
    // ... essential capabilities
    "appium:platformVersion": "17.0",               // iOS version
    "appium:noReset": true,                         // Don't reset app between tests
    "appium:fullReset": false,                      // Don't reinstall the app
    "appium:autoAcceptAlerts": true,                // Accept alerts automatically
}
```

---

## 🚗 Automation Names (Drivers)

The `automationName` defines which **Appium driver** will be used for automation:

### Android Drivers

| Automation Name | Description | Recommended Use |
|-----------------|-------------|-----------------|
| `UiAutomator2` | Modern Android driver (API 16+) | ✅ **Recommended** for native apps |
| `Espresso` | Google Espresso-based driver | 🎯 Apps with specific Espresso support |

### iOS Drivers

| Automation Name | Description | Recommended Use |
|-----------------|-------------|-----------------|
| `XCUITest` | Modern iOS driver (iOS 9.3+) | ✅ **Recommended** for native apps |
| `UIAutomation` | Legacy driver (deprecated) | ❌ Not recommended |

> **📖 Complete documentation:** To see all available drivers and their specific options, check the [official Appium documentation](https://appium.io/docs/en/2.5/ecosystem/drivers/).

---

## 🎯 Purpose of Capabilities

### Identification Capabilities
- **`platformName`**: Defines the platform (Android/iOS)
- **`deviceName`**: Descriptive name to identify the device in reports
- **`udid`**: Unique identifier that specifies exactly which device to use

### Application Capabilities
- **`appPackage`/`bundleId`**: Identifies which application to open
- **`appActivity`**: Specifies the initial screen of the app (Android)
- **`app`**: Path to .apk/.ipa file for installation

### Behavior Capabilities
- **`noReset`**: Maintains app state between tests
- **`fullReset`**: Completely reinstalls the app
- **`autoGrantPermissions`**: Accepts permissions automatically (Android)
- **`autoAcceptAlerts`**: Accepts alerts automatically (iOS)
- **`unicodeKeyboard`**: Enables Unicode keyboard for special characters (Android)
- **`resetKeyboard`**: Restores original keyboard after test (Android)

## 📚 References

- **[📱 Device Inspection](en/prerequisites/device.md)** - How to get UDIDs, appPackage, bundleId
- **[🔧 Project Configuration](en/configuration/projects.md)** - Using capabilities in playwright.config.ts
- **[📖 Appium Documentation](https://appium.io/docs/en/2.0/guides/caps/)** - Complete Appium capabilities
# 🛠️ Utility Commands & Tools
*playwright-io Development and Debugging Utilities*

## 🎯 Overview

This comprehensive guide provides essential utility commands, debugging tools, and helper functions for effective mobile automation testing with playwright-io. These utilities will help you inspect devices, debug tests, and optimize your automation workflow.

## 📱 Device Information Commands

### **Android Device Utilities**

#### **Package and Activity Information**
```bash
# Get current app package and activity (most important for automation)
adb shell dumpsys window | grep -E 'mCurrentFocus|mFocusedApp'

# Get detailed app information
adb shell dumpsys package <package_name>

# List all installed packages
adb shell pm list packages

# Get launchable activities for a package
adb shell pm dump <package_name> | grep -A 5 -B 5 "android.intent.action.MAIN"

# Get app version
adb shell dumpsys package <package_name> | grep versionName
```

#### **Device Identification**
```bash
# Get device UDID/Serial number
adb devices -l

# Get specific device information
adb shell getprop ro.serialno
adb shell getprop ro.product.model
adb shell getprop ro.product.manufacturer
adb shell getprop ro.build.version.release

# Get device screen information
adb shell wm size
adb shell wm density
```

#### **Hardware Information**
```bash
# CPU architecture
adb shell getprop ro.product.cpu.abi

# Memory information
adb shell cat /proc/meminfo | grep -E "(MemTotal|MemAvailable)"

# Storage information
adb shell df -h

# Battery information
adb shell dumpsys battery
```

### **iOS Device Utilities**

#### **Device Identification and Information**
```bash
# List all iOS devices and simulators with UDID
xcrun xctrace list devices

# Alternative method for instruments
xcrun instruments -s devices

# Get simulator information
xcrun simctl list devices available

# Boot specific simulator and get UDID
xcrun simctl create "Test iPhone" com.apple.CoreSimulator.SimDeviceType.iPhone-14 \
  com.apple.CoreSimulator.SimRuntime.iOS-17-0
```

#### **App Information (iOS)**
```bash
# List installed apps on simulator
xcrun simctl listapps "iPhone 14"

# Install app on simulator
xcrun simctl install "iPhone 14" /path/to/app.app

# Launch app and get bundle ID
xcrun simctl launch "iPhone 14" com.example.app

# Get app bundle information
codesign -d --entitlements - /path/to/app.app
```

### **Windows Application Utilities**

#### **Windows App Information**
```powershell
# List all installed Windows apps
Get-StartApps

# Get app details
Get-AppxPackage | Where-Object {$_.Name -like "*AppName*"}

# Get app executable path
Get-Process "AppName" | Select-Object Path

# Get window information
Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object ProcessName, MainWindowTitle
```

---

## 🚀 App Installation & Configuration

### **Local App Testing Setup**

#### **Android App Installation**
```typescript
// playwright.config.ts for local Android app testing
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";
import { join } from "path";

export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'Android-Local-App',
      use: {
        capabilities: {
          platformName: 'Android',
          "appium:automationName": "UiAutomator2",
          "appium:udid": "DEVICE_UDID_HERE", // From adb devices
          "appium:app": join(process.cwd(), 'apps/app-release.apk'),
          // Alternative: Use installed app
          // "appium:appPackage": "com.example.app",
          // "appium:appActivity": ".MainActivity",
          "appium:autoGrantPermissions": true,
          "appium:noReset": false // Fresh app state for each test
        }
      }
    }
  ]
});
```

#### **iOS App Installation**
```typescript
// playwright.config.ts for local iOS app testing
export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'iOS-Local-App',
      use: {
        capabilities: {
          platformName: 'iOS',
          "appium:automationName": "XCUITest",
          "appium:udid": "DEVICE_UDID_HERE", // From xcrun xctrace list devices
          "appium:app": join(process.cwd(), 'apps/app.ipa'),
          // Alternative: Use installed app
          // "appium:bundleId": "com.example.app",
          "appium:noReset": false,
          "appium:fullReset": true // Complete app reset
        }
      }
    }
  ]
});
```

#### **Windows App Configuration**
```typescript
// playwright.config.ts for Windows app testing
export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'Windows-Local-App',
      use: {
        capabilities: {
          platformName: 'Windows',
          "appium:automationName": "Windows",
          "appium:app": "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App",
          // Alternative: Use executable path
          // "appium:app": "C:\\Path\\To\\Your\\App.exe",
          "appium:deviceName": "WindowsPC"
        }
      }
    }
  ]
});
```

---

## 🔍 Debugging and Inspection Tools

### **Element Inspection Utilities**

```typescript
// Enhanced element inspection utilities
import { test, expect } from 'playwright-io';

test('Element inspection helpers', async ({ driver, page }) => {
  // Get current app state
  const packageName = await driver.getCurrentPackage(); // Android
  const activity = await driver.getCurrentActivity(); // Android
  
  console.log(`Current app: ${packageName}`);
  console.log(`Current activity: ${activity}`);
  
  // Get page source for debugging
  const pageSource = await driver.getPageSource();
  console.log('Page XML:', pageSource);
  
  // Get all contexts (useful for hybrid apps)
  const contexts = await driver.getContexts();
  console.log('Available contexts:', contexts);
  
  // Switch context if needed (for webview testing)
  if (contexts.length > 1) {
    await driver.switchContext(contexts[1]); // Switch to webview
    // Now you can use Playwright page methods
    await page.locator('input[type="text"]').fill('Hello World');
    await driver.switchContext('NATIVE_APP'); // Switch back
  }
});
```

### **App State Management**

```typescript
// App lifecycle and state management
test('App state utilities', async ({ driver }) => {
  // Background and foreground app
  await driver.background(5); // Background for 5 seconds
  
  // Terminate and restart app
  await driver.terminateApp('com.example.app');
  await driver.activateApp('com.example.app');
  
  // Install app during test
  await driver.installApp('/path/to/new-version.apk');
  
  // Remove app
  await driver.removeApp('com.example.app');
  
  // Check if app is installed
  const isInstalled = await driver.isAppInstalled('com.example.app');
  expect(isInstalled).toBeTruthy();
});
```

---

## 📊 Performance Monitoring

### **Performance Testing Utilities**

```typescript
// Performance monitoring utilities
import { test, expect } from 'playwright-io';

test('Performance monitoring', async ({ driver, page }) => {
  // Start performance monitoring
  const startTime = Date.now();
  
  // Perform app actions
  await page.locator('#login-button').click();
  await page.locator('#username').fill('testuser');
  await page.locator('#password').fill('password');
  await page.locator('#submit').click();
  
  // Wait for login completion
  await page.locator('#dashboard').waitFor();
  
  const loadTime = Date.now() - startTime;
  console.log(`Login flow completed in: ${loadTime}ms`);
  
  // Assert performance thresholds
  expect(loadTime).toBeLessThan(10000); // 10 second max
  
  // Get device performance data (Android)
  if (process.env.PLATFORM === 'Android') {
    const perfData = await driver.getPerformanceData('com.example.app', 'memoryinfo');
    console.log('Memory usage:', perfData);
  }
});
```

### **Battery and Resource Monitoring**

```typescript
// Resource monitoring utilities
test('Resource monitoring', async ({ driver }) => {
  if (process.env.PLATFORM === 'Android') {
    // Monitor battery usage
    const batteryInfo = await driver.getBatteryInfo();
    console.log('Battery level:', batteryInfo.level);
    console.log('Battery state:', batteryInfo.state);
    
    // Get device temperature
    const deviceTime = await driver.getDeviceTime();
    console.log('Device time:', deviceTime);
  }
});
```

---

## 🛠️ Advanced Utilities

### **Network and Connectivity**

```typescript
// Network utilities
test('Network management', async ({ driver }) => {
  // Toggle network states (Android)
  if (process.env.PLATFORM === 'Android') {
    // Toggle WiFi
    await driver.toggleWifi();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.toggleWifi(); // Turn back on
    
    // Toggle mobile data
    await driver.toggleData();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await driver.toggleData(); // Turn back on
    
    // Set network speed (requires network conditioning)
    await driver.setNetworkSpeed('3g');
  }
});
```

### **Device Gestures and Interactions**

```typescript
// Advanced gesture utilities
test('Device gestures', async ({ driver, page }) => {
  // Device rotation
  await driver.rotate('LANDSCAPE');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await driver.rotate('PORTRAIT');
  
  // Lock and unlock device
  await driver.lock(3); // Lock for 3 seconds
  await driver.unlock();
  
  // Shake device (iOS)
  if (process.env.PLATFORM === 'iOS') {
    await driver.shake();
  }
  
  // Custom gestures
  const element = await page.locator('#swipeable-element');
  const { x, y, width, height } = await element.boundingBox();
  
  // Swipe gesture
  await driver.swipe(
    x + width * 0.8,  // Start X (80% across)
    y + height * 0.5, // Start Y (middle)
    x + width * 0.2,  // End X (20% across)
    y + height * 0.5, // End Y (same)
    800 // Duration in ms
  );
});
```

---

## 📋 Quick Reference Scripts

### **Environment Check Script**

```bash
#!/bin/bash
# save as check_mobile_env.sh

echo "=== Mobile Testing Environment Check ==="

# Node.js and npm
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "NPM: $(npm --version 2>/dev/null || echo 'Not installed')"

# Appium
echo "Appium: $(appium --version 2>/dev/null || echo 'Not installed')"
echo "Appium Drivers: $(appium driver list --installed 2>/dev/null || echo 'None')"

# Platform specific checks
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "=== iOS Environment ==="
  echo "Xcode: $(xcodebuild -version 2>/dev/null | head -1 || echo 'Not installed')"
  echo "iOS Simulators: $(xcrun simctl list devices 2>/dev/null | grep -c iPhone || echo '0')"
  echo "iOS Devices: $(xcrun xctrace list devices 2>/dev/null | grep -v Simulator | wc -l || echo '0')"
fi

echo "=== Android Environment ==="
if [ ! -z "$ANDROID_HOME" ]; then
  echo "Android SDK: $ANDROID_HOME"
  echo "ADB: $(adb version 2>/dev/null | head -1 || echo 'Not found')"
  echo "Android Devices: $(adb devices 2>/dev/null | tail -n +2 | grep -v '^$' | wc -l || echo '0')"
else
  echo "ANDROID_HOME not set"
fi

echo "Java: $(java -version 2>&1 | head -1 || echo 'Not installed')"
```

### **Device Info Script**

```bash
#!/bin/bash
# save as get_device_info.sh

echo "=== Connected Devices Information ==="

echo "--- Android Devices ---"
if command -v adb &> /dev/null; then
  adb devices -l | tail -n +2 | while read line; do
    if [ ! -z "$line" ]; then
      device_id=$(echo $line | awk '{print $1}')
      echo "Device: $device_id"
      echo "  Model: $(adb -s $device_id shell getprop ro.product.model 2>/dev/null)"
      echo "  Android: $(adb -s $device_id shell getprop ro.build.version.release 2>/dev/null)"
      echo "  API Level: $(adb -s $device_id shell getprop ro.build.version.sdk 2>/dev/null)"
      echo ""
    fi
  done
else
  echo "ADB not available"
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "--- iOS Devices ---"
  if command -v xcrun &> /dev/null; then
    xcrun xctrace list devices 2>/dev/null | grep -v "Simulator" | grep -E "iPhone|iPad" | while read line; do
      echo "Device: $line"
    done
    
    echo "--- iOS Simulators (Booted) ---"
    xcrun simctl list devices 2>/dev/null | grep "Booted" | while read line; do
      echo "Simulator: $line"
    done
  else
    echo "Xcode tools not available"
  fi
fi
```

### **App Analysis Script**

```bash
#!/bin/bash
# save as analyze_app.sh

if [ $# -eq 0 ]; then
  echo "Usage: $0 <package_name_or_bundle_id>"
  exit 1
fi

APP_ID=$1

echo "=== App Analysis for: $APP_ID ==="

# Android analysis
if command -v adb &> /dev/null && adb devices | grep -q "device$"; then
  echo "--- Android App Info ---"
  
  # Check if app is installed
  if adb shell pm list packages | grep -q "$APP_ID"; then
    echo "✅ App is installed"
    
    # Get app version
    echo "Version: $(adb shell dumpsys package $APP_ID | grep versionName | head -1)"
    
    # Get main activity
    echo "Main Activity:"
    adb shell pm dump $APP_ID | grep -A 5 -B 5 "android.intent.action.MAIN" | grep "activity"
    
    # Get permissions
    echo "Permissions:"
    adb shell pm dump $APP_ID | grep "android.permission" | head -10
  else
    echo "❌ App not installed"
  fi
fi

# iOS analysis (for simulators)
if [[ "$OSTYPE" == "darwin"* ]] && command -v xcrun &> /dev/null; then
  echo "--- iOS App Info ---"
  
  # Check booted simulators
  BOOTED_SIM=$(xcrun simctl list devices | grep "Booted" | head -1 | sed 's/.*(\([^)]*\)).*/\1/')
  
  if [ ! -z "$BOOTED_SIM" ]; then
    if xcrun simctl listapps "$BOOTED_SIM" | grep -q "$APP_ID"; then
      echo "✅ App is installed on simulator: $BOOTED_SIM"
      xcrun simctl listapps "$BOOTED_SIM" | grep -A 5 -B 5 "$APP_ID"
    else
      echo "❌ App not found on booted simulator"
    fi
  else
    echo "No booted iOS simulator found"
  fi
fi
```

---

## 🎯 Best Practices

### **Utility Usage Guidelines**

1. **Device Preparation**
   - Always verify device connection before running tests
   - Use device info scripts to document test environment
   - Keep device logs during test execution

2. **App State Management**
   - Reset app state between test runs for consistency
   - Use fresh installs for critical test scenarios
   - Monitor app performance during extended test runs

3. **Debugging Workflow**
   - Start with environment verification scripts
   - Use element inspection tools before writing selectors
   - Capture screenshots and logs at failure points

4. **Performance Monitoring**
   - Set realistic performance thresholds
   - Monitor resource usage on real devices
   - Test under various network conditions

---

## 📚 Additional Resources

- [🔧 ADB Commands Reference](https://developer.android.com/studio/command-line/adb)
- [🍎 iOS Debugging Tools](https://developer.apple.com/documentation/xcode/debugging)
- [📱 Appium Commands API](https://appium.github.io/appium.io/docs/en/commands/)
- [⚡ Mobile Performance Testing](https://github.com/appium/appium/blob/master/docs/en/writing-running-appium/performance.md)
# 🍎 iOS & Xcode Setup Guide
*playwright-io iOS Environment Configuration*

## 🎯 Overview

This comprehensive guide covers the complete setup process for iOS automation testing with playwright-io. Configure your macOS development environment for iOS device and simulator testing.

**⚠️ Important**: iOS automation requires macOS. Windows and Linux are not supported for iOS testing.

## 🔧 System Requirements

### **Required Software**
- ✅ **Xcode**: Latest version from Mac App Store
- ✅ **Command Line Tools**: Xcode command line utilities
- ✅ **iOS Simulator**: Included with Xcode
- ✅ **Node.js**: Version 18.20.0 or higher

---

## 📦 Installation Process

### **Step 1: Install Xcode**

#### **Method 1: Mac App Store (Recommended)**
1. Open **Mac App Store**
2. Search for "Xcode"
3. Click **Install** (requires Apple ID)
4. Wait for download completion (8-12GB)

#### **Method 2: Apple Developer Portal**
1. Visit [Apple Developer Downloads](https://developer.apple.com/download/)
2. Sign in with Apple ID
3. Download Xcode .xip file
4. Double-click to extract and install

### **Step 2: Install Command Line Tools**

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Accept license agreements
sudo xcodebuild -license accept

# Verify installation
xcode-select -p
# Expected output: /Applications/Xcode.app/Contents/Developer
```

### **Step 3: Configure iOS Development Environment**

#### **1. Launch Xcode First Time Setup**
```bash
# Open Xcode to complete initial setup
open /Applications/Xcode.app

# Or from terminal
xed .
```

#### **2. Download iOS Simulators**
1. Open Xcode
2. Go to `Xcode > Preferences > Components`
3. Download desired iOS versions:
   - iOS 17.0 Simulator (latest)
   - iOS 16.4 Simulator
   - iOS 15.5 Simulator (for compatibility)

#### **3. Install Additional Tools**
```bash
# Install iOS Device Support
# This happens automatically when connecting devices

# Verify simulators available
xcrun simctl list devices available
```

---

## 📱 Device & Simulator Configuration

### **iOS Simulator Setup**

#### **Create Custom Simulators**
```bash
# List available device types
xcrun simctl list devicetypes

# List available runtimes  
xcrun simctl list runtimes

# Create new simulator
xcrun simctl create "Playwright iPhone 14" \
  "com.apple.CoreSimulator.SimDeviceType.iPhone-14" \
  "com.apple.CoreSimulator.SimRuntime.iOS-17-0"

# List all simulators
xcrun simctl list devices
```

#### **Manage Simulators**
```bash
# Boot simulator
xcrun simctl boot "iPhone 14"

# Open Simulator app
open -a Simulator

# Shutdown simulator
xcrun simctl shutdown "iPhone 14"

# Delete simulator
xcrun simctl delete "iPhone 14"
```

### **Physical Device Setup**

#### **1. Enable Developer Mode**
- Connect iOS device to Mac
- Trust computer when prompted
- Go to `Settings > Privacy & Security > Developer Mode`
- Enable Developer Mode
- Restart device

#### **2. Device Provisioning**
1. **Open Xcode**
2. **Go to Window > Devices and Simulators**
3. **Select your device**
4. **Click "Use for Development"**
5. **Sign in with Apple Developer Account**

#### **3. App Installation (for native app testing)**
```bash
# Install app on device via Xcode
# Or use ios-deploy for command line
npm install -g ios-deploy

# Install .ipa file
ios-deploy --bundle /path/to/app.ipa
```

---

## 🌍 Environment Variables Configuration

### **Required Environment Variables**

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
export DEVELOPER_DIR="/Applications/Xcode.app/Contents/Developer"

# Optional: iOS deployment target
export IPHONEOS_DEPLOYMENT_TARGET="12.0"

# Reload shell configuration
source ~/.zshrc  # or your shell config file
```

### **Xcode Path Configuration**
```bash
# Set active developer directory
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer

# Verify configuration
xcode-select -p
```

---

## ✅ Verification Process

### **Environment Verification**

```bash
# Check Xcode installation
xcodebuild -version
# Expected: Xcode 15.x Build version xxxxx

# Check command line tools
xcode-select -p
# Expected: /Applications/Xcode.app/Contents/Developer

# Check available simulators
xcrun simctl list devices available | grep iPhone
# Expected: List of iPhone simulators

# Check connected devices
xcrun xctrace list devices
# Expected: List of connected iOS devices and simulators
```

### **iOS Simulator Test**
```bash
# Quick simulator test
xcrun simctl boot "iPhone 14"
xcrun simctl spawn "iPhone 14" log stream --predicate 'process == "SpringBoard"'
```

### **playwright-io Integration Test**

Create a test configuration to verify iOS setup:

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'iOS-Simulator',
      use: {
        capabilities: {
          platformName: 'iOS',
          "appium:automationName": "XCUITest",
          "appium:deviceName": "iPhone 14",
          "appium:platformVersion": "17.0",
          "appium:browserName": "Safari", // For browser testing
          // OR for app testing:
          // "appium:app": "/path/to/your/app.app",
          // "appium:bundleId": "com.example.app",
        }
      }
    },
    {
      name: 'iOS-Device',
      use: {
        capabilities: {
          platformName: 'iOS',
          "appium:automationName": "XCUITest",
          "appium:deviceName": "Your iPhone", // Real device name
          "appium:udid": "YOUR_DEVICE_UDID", // Get with: xcrun xctrace list devices
          "appium:browserName": "Safari",
        }
      }
    }
  ]
});
```

### **Basic iOS Test Example**

```typescript
// tests/ios-verification.spec.ts
import { test, expect } from 'playwright-io';

test('iOS environment verification', async ({ driver, page }) => {
  // Verify driver connection
  const session = await driver.getSession();
  console.log('iOS Device info:', session);
  
  // For Safari browser testing
  await driver.url('https://www.apple.com');
  await expect(page.locator('input[type="search"]')).toBeVisible();
  
  // Take screenshot for verification
  await driver.saveScreenshot('./ios-verification.png');
});
```

---

## 🔧 Troubleshooting

### **Common Issues and Solutions**

#### **Issue: Xcode license not accepted**
```bash
# Solution: Accept license
sudo xcodebuild -license accept
```

#### **Issue: Command line tools not found**
```bash
# Solution: Install command line tools
xcode-select --install

# Reset if needed
sudo xcode-select --reset
```

#### **Issue: Simulator not booting**
```bash
# Solution: Reset simulator
xcrun simctl shutdown all
xcrun simctl erase all

# Recreate simulator if needed
xcrun simctl delete "iPhone 14"
xcrun simctl create "iPhone 14" \
  "com.apple.CoreSimulator.SimDeviceType.iPhone-14" \
  "com.apple.CoreSimulator.SimRuntime.iOS-17-0"
```

#### **Issue: Device not recognized**
```bash
# Solution: Check device connection
xcrun xctrace list devices

# Trust computer on device
# Check device is in developer mode
```

#### **Issue: Certificate/Provisioning errors**
- Open Xcode
- Go to `Preferences > Accounts`
- Add Apple Developer Account
- Download provisioning profiles

### **Performance Optimization**

#### **Simulator Performance**
```bash
# Allocate more resources to simulator
# Edit simulator settings in Simulator > Device > Device Settings

# Close unnecessary simulators
xcrun simctl shutdown all
```

#### **Disk Space Management**
```bash
# Clean Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean old simulator data
xcrun simctl delete unavailable
```

---

## 📋 Quick Reference

### **Essential Simulator Commands**
```bash
# Simulator management
xcrun simctl list devices                    # List all simulators
xcrun simctl boot "iPhone 14"              # Boot simulator
xcrun simctl shutdown "iPhone 14"          # Shutdown simulator
xcrun simctl erase "iPhone 14"             # Reset simulator

# App management
xcrun simctl install "iPhone 14" /path/to/app.app  # Install app
xcrun simctl launch "iPhone 14" com.example.app    # Launch app
xcrun simctl uninstall "iPhone 14" com.example.app # Uninstall app

# Device information
xcrun simctl getenv "iPhone 14" HOME       # Get environment variables
xcrun simctl spawn "iPhone 14" ps aux      # List running processes

# Screenshots and videos
xcrun simctl io "iPhone 14" screenshot screen.png     # Take screenshot
xcrun simctl io "iPhone 14" recordVideo video.mov     # Record video
```

### **Device Information Commands**
```bash
# Connected devices
xcrun xctrace list devices
instruments -s devices

# Device details
ideviceinfo --udid YOUR_UDID              # Requires libimobiledevice
system_profiler SPUSBDataType | grep iPhone
```

### **Xcode Tools Quick Check**
```bash
# Comprehensive environment check
echo "Xcode: $(xcodebuild -version | head -1)" && \
echo "Tools: $(xcode-select -p)" && \
echo "Simulators: $(xcrun simctl list devices available | grep iPhone | wc -l) available"
```

---

## 🍎 iOS-Specific Considerations

### **Browser Testing Limitations**
- Only Safari is available for browser testing
- Safari version depends on iOS version
- WebKit engine limitations compared to Chrome/Firefox

### **App Testing Requirements**
- Apps must be signed for device testing
- Simulator allows unsigned apps
- iOS 9+ required for XCUITest automation

### **Permission Handling**
```typescript
// Handle iOS permissions in tests
test('Handle location permission', async ({ driver }) => {
  // Accept permission alerts
  await driver.acceptAlert();
  
  // Or dismiss
  await driver.dismissAlert();
});
```

---

## 🎯 Next Steps

After completing iOS setup:

1. ✅ **Install Appium**: Follow [Appium Setup Guide](appium.md)
2. ✅ **Configure playwright-io**: Set up your test project
3. ✅ **Write Your First iOS Test**: Create iOS automation tests
4. ✅ **Set Up Real Device Testing**: Configure provisioning profiles
5. ✅ **CI/CD Integration**: Set up automated testing with GitHub Actions

---

## 📚 Additional Resources

- [📖 Apple Developer Documentation](https://developer.apple.com/documentation/)
- [🛠️ Xcode Documentation](https://developer.apple.com/xcode/)
- [🎯 XCUITest Framework](https://developer.apple.com/documentation/xctest)
- [📱 iOS Testing Best Practices](https://developer.apple.com/documentation/xctest/user_interface_tests)
- [🔧 iOS Simulator Guide](https://developer.apple.com/documentation/xcode/running-your-app-in-the-simulator)
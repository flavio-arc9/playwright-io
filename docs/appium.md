# 🤖 Appium Installation & Configuration Guide
*playwright-io Mobile Automation Setup*

## 🎯 Overview

This comprehensive guide covers the complete Appium installation and configuration process for playwright-io. Appium is the mobile automation server that enables native mobile app and browser testing across iOS and Android platforms.

## 🔧 Prerequisites

### **System Requirements**
- **Node.js**: Version 18.20.0 or higher (**Required**)
- **NPM/Yarn**: Package manager included with Node.js
- **Platform Setup**: Complete [Android Setup](android.md) and/or [iOS Setup](xcode.md)

### **Platform-Specific Prerequisites**

#### **For Android Testing:**
- ✅ Java Development Kit (JDK) 11+
- ✅ Android SDK and Platform Tools
- ✅ Android device or emulator
- ✅ USB debugging enabled

#### **For iOS Testing (macOS only):**
- ✅ Xcode with Command Line Tools
- ✅ iOS Simulator or physical device
- ✅ Apple Developer Account (for device testing)

---

## 📦 Installation Methods

### **Method 1: NPM Global Installation (Recommended)**

```bash
# Install Appium globally
npm install -g appium@latest

# Verify installation
appium --version
# Expected output: 2.x.x

# Check Appium installation directory
which appium
```

### **Method 2: Yarn Global Installation**

```bash
# Install Appium globally with Yarn
yarn global add appium@latest

# Verify installation
appium --version
```

### **Method 3: Local Project Installation**

```bash
# Install in your project directory
npm install --save-dev appium@latest

# Run via npx
npx appium --version
```

---

## 🚀 Driver Installation

Appium 2.0+ requires separate driver installation for each platform:

### **Android Driver (UiAutomator2)**

```bash
# Install Android UiAutomator2 driver
appium driver install uiautomator2

# Verify driver installation
appium driver list --installed
# Expected: uiautomator2@x.x.x [installed]
```

### **iOS Driver (XCUITest)**

```bash
# Install iOS XCUITest driver (macOS only)
appium driver install xcuitest

# Verify driver installation
appium driver list --installed
# Expected: xcuitest@x.x.x [installed]
```

### **Windows Driver (Optional)**

```bash
# Install Windows driver for Windows app automation
appium driver install windows

# Verify installation
appium driver list --installed
```

### **Install Multiple Drivers**

```bash
# Install multiple drivers at once
appium driver install uiautomator2 xcuitest windows

# List all available drivers
appium driver list
```

---

## ⚙️ Configuration & Setup

### **Appium Server Configuration**

#### **Basic Server Start**
```bash
# Start Appium server with default settings
appium

# Start with custom host and port
appium --address 127.0.0.1 --port 4723

# Start with verbose logging
appium --log-level debug

# Allow Chrome driver auto-download for mobile browser testing
appium --allow-insecure chromedriver_autodownload
```

#### **Advanced Configuration**
```bash
# Start with configuration file
appium --config-file ./appium-config.json

# Start with specific capabilities
appium --default-capabilities '{"platformName": "Android"}'

# Start with plugins
appium --use-plugins images,execute-driver

# Allow insecure features for mobile testing
appium --allow-insecure chromedriver_autodownload,adb_shell
```

### **Configuration File Example**

Create `appium-config.json`:

```json
{
  "server": {
    "address": "127.0.0.1",
    "port": 4723,
    "keep-alive-timeout": 600,
    "command-timeout": 60,
    "session-override": true,
    "log-level": "info",
    "allow-insecure": ["chromedriver_autodownload", "adb_shell"]
  },
  "android": {
    "automation-name": "UiAutomator2",
    "platform-version": "11.0"
  },
  "ios": {
    "automation-name": "XCUITest", 
    "platform-version": "17.0"
  }
}
```

---

## 🔍 Environment Verification

### **Appium Doctor**

Install and run Appium Doctor to verify your environment:

```bash
# Install Appium Doctor
npm install -g appium-doctor

# Check environment for Android
appium-doctor --android

# Check environment for iOS (macOS only)
appium-doctor --ios

# Check both platforms
appium-doctor
```

### **Expected Appium Doctor Output**

#### **Android Checks:**
```
✔ The Node.js binary was found at: /usr/local/bin/node
✔ Node version is 18.20.0
✔ ANDROID_HOME is set to: /Users/user/Library/Android/sdk
✔ JAVA_HOME is set to: /Library/Java/JavaVirtualMachines/jdk-11.0.x
✔ adb exists at: /Users/user/Library/Android/sdk/platform-tools/adb
✔ android exists at: /Users/user/Library/Android/sdk/tools/android
✔ emulator exists at: /Users/user/Library/Android/sdk/emulator/emulator
```

#### **iOS Checks (macOS):**
```
✔ The Node.js binary was found at: /usr/local/bin/node
✔ Node version is 18.20.0
✔ Xcode is installed at: /Applications/Xcode.app/Contents/Developer
✔ Xcode Command Line Tools are installed
✔ iOS Device Support is installed
```

---

## 🧪 Testing Your Installation

### **Test Appium Server**

```bash
# Start Appium server in one terminal
appium

# In another terminal, test server status
curl http://127.0.0.1:4723/status

# Expected response: {"build": {...}, "os": {...}}
```

### **Basic Test with playwright-io**

Create a verification test:

```typescript
// tests/appium-verification.spec.ts
import { test, expect } from 'playwright-io';

test.describe('Appium Installation Verification', () => {
  test('Android driver connection', async ({ driver }) => {
    // This test verifies Appium server and driver are working
    const session = await driver.getSession();
    
    expect(session).toBeDefined();
    expect(session.capabilities).toBeDefined();
    
    console.log('Appium session created successfully:', session.id);
    console.log('Device capabilities:', session.capabilities);
  });
  
  test('Take screenshot test', async ({ driver }) => {
    // Verify screenshot functionality
    const screenshot = await driver.takeScreenshot();
    expect(screenshot).toBeDefined();
    expect(screenshot.length).toBeGreaterThan(0);
    
    console.log('Screenshot captured successfully');
  });
});
```

### **Playwright Configuration for Testing**

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
  testDir: "./tests",
  timeout: 60000,
  
  projects: [
    {
      name: "android-verification",
      use: {
        appiumServerUrl: "http://127.0.0.1:4723",
        capabilities: {
          platformName: "Android",
          "appium:automationName": "UiAutomator2",
          "appium:deviceName": "Android Emulator",
          "appium:browserName": "Chrome",
        }
      }
    }
  ]
});
```

---

## 🔧 Troubleshooting

### **Common Installation Issues**

#### **Issue: `appium: command not found`**
```bash
# Solution 1: Check npm global directory
npm config get prefix
# Add to PATH: export PATH=$PATH:/usr/local/bin

# Solution 2: Use npx
npx appium --version

# Solution 3: Reinstall globally
npm uninstall -g appium
npm install -g appium@latest
```

#### **Issue: Node.js version conflict**
```bash
# Check Node.js version
node --version

# Update Node.js if needed
# Use nvm for version management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18.20.0
nvm use 18.20.0
```

#### **Issue: Driver installation fails**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall drivers
appium driver uninstall uiautomator2
appium driver install uiautomator2

# Check driver directory
ls ~/.appium/node_modules
```

#### **Issue: Permission denied errors**
```bash
# Fix npm permissions (avoid using sudo)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to ~/.bashrc or ~/.zshrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
```

### **Server Connection Issues**

#### **Issue: Server won't start**
```bash
# Check if port is in use
lsof -i :4723

# Kill existing processes
pkill -f appium

# Start with different port
appium --port 4724
```

#### **Issue: Driver session fails**
```bash
# Check driver installation
appium driver list --installed

# Update drivers
appium driver update uiautomator2

# Reset Appium cache
rm -rf ~/.appium
```

---

## 🚀 Advanced Configuration

### **Appium Plugins**

```bash
# Install useful plugins
appium plugin install images
appium plugin install execute-driver
appium plugin install relaxed-caps

# Start Appium with plugins
appium --use-plugins images,execute-driver
```

### **Grid Setup (Multiple Devices)**

```bash
# Start Appium hub
appium --address 0.0.0.0 --port 4723

# Start node for specific device
appium --address 0.0.0.0 --port 4724 \
  --nodeconfig node-config.json
```

### **Docker Setup**

```bash
# Run Appium in Docker
docker run --rm -it -p 4723:4723 \
  -v /dev/bus/usb:/dev/bus/usb \
  --privileged \
  appium/appium:latest
```

---

## 📋 Quick Reference

### **Essential Appium Commands**
```bash
# Server management
appium                              # Start server
appium --port 4724                  # Custom port
appium --log-level debug            # Debug mode
appium --session-override           # Allow session override
appium --allow-insecure chromedriver_autodownload  # Mobile browser testing

# Driver management
appium driver list                  # List available drivers
appium driver install uiautomator2  # Install driver
appium driver update uiautomator2   # Update driver
appium driver uninstall uiautomator2 # Remove driver

# Plugin management
appium plugin list                  # List available plugins
appium plugin install images       # Install plugin
appium --use-plugins images         # Use plugin

# Configuration
appium config                       # Show config
appium --config-file config.json    # Use config file
```

### **Environment Check Commands**
```bash
# Comprehensive environment verification
echo "Node.js: $(node --version)" && \
echo "NPM: $(npm --version)" && \
echo "Appium: $(appium --version)" && \
echo "Drivers: $(appium driver list --installed)"
```

---

## 🎯 Next Steps

After completing Appium installation:

1. ✅ **Platform Setup**: Ensure [Android](android.md) or [iOS](xcode.md) is configured
2. ✅ **Install playwright-io**: Set up your test project
3. ✅ **Configure Test Environment**: Create Playwright configuration
4. ✅ **Write Your First Test**: Start automating mobile apps
5. ✅ **CI/CD Integration**: Set up automated testing pipeline

---

## 📚 Additional Resources

- [📖 Appium Official Documentation](https://appium.io/docs/en/2.0/)
- [🛠️ Appium GitHub Repository](https://github.com/appium/appium)
- [🎯 UiAutomator2 Driver Docs](https://github.com/appium/appium-uiautomator2-driver)
- [🍎 XCUITest Driver Docs](https://github.com/appium/appium-xcuitest-driver)
- [🔧 Appium Desktop Inspector](https://github.com/appium/appium-inspector)
- [📱 Appium Best Practices](https://appiumpro.com/)

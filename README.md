# 📱 Playwright-IO
*Playwright Library for Native Mobile Testing*

[![npm version](https://badge.fury.io/js/playwright-io.svg)](https://www.npmjs.com/package/playwright-io)
[![Node.js CI](https://github.com/fromeroc9/playwright-io/workflows/Node.js%20CI/badge.svg)](https://github.com/fromeroc9/playwright-io/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.sv### 🏗️ **SelectorStrategy Interface**
```typescript
interface SelectorStrategy {
  android?: string;  // Android-specific selector (UiAutomator2)
  ios?: string;      // iOS-specific selector (XCUITest)  
  web?: string;      // Web/WebView selector (CSS/XPath)
}
```

## 🔧 Advanced Features

### 📱 **Context Management**ww.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🏗️ Technical Overview

**playwright-io** is a TypeScript library that extends Playwright's testing capabilities with native mobile automation support. Built on top of WebDriverIO and the Appium ecosystem, this library provides seamless integration between Playwright's modern testing API and mobile device automation, allowing developers to write cross-platform tests using familiar Playwright syntax while leveraging mature mobile automation infrastructure.

### 🎯 Core Architecture

The library implements an adapter pattern that extends Playwright with mobile capabilities:

- **Playwright Extension**: Extends Playwright's fixture system with mobile-specific capabilities
- **WebDriverIO Integration**: Handles mobile device communication and session management  
- **Appium Foundation**: Manages platform-specific drivers (UiAutomator2, XCUITest) for device interactions

### 🔧 Technical Capabilities

This library enables comprehensive mobile automation through:
- **Native Mobile App Testing**: Direct interaction with Android and iOS applications
- **Mobile Browser Automation**: Chrome, Safari, and WebView testing on mobile devices
- **Cross-Platform Element Strategies**: Adaptive selector resolution based on runtime platform detection
- **Session Management**: Intelligent WebDriver session lifecycle with automatic cleanup
- **Media Capture Integration**: Screenshots and video recordings attached to Playwright reports
- **Dual Recording Systems**: Native mobile recording (Appium) and browser recording (FFmpeg)

## ✨ Key Features

### 🚀 **Core Functionality**
- ✅ **Playwright Extension**: Seamlessly extends Playwright with mobile automation capabilities
- ✅ **Native Application Automation**: Full support for Android and iOS native app testing
- ✅ **Mobile Browser Testing**: Chrome, Safari, and WebView automation on mobile devices  
- ✅ **Hybrid Context Switching**: Seamless transition between native and web contexts
- ✅ **Cross-Platform Element Resolution**: Adaptive selector strategies per platform
- ✅ **Enhanced Fixture System**: Mobile-specific fixtures integrated with Playwright's test runner

### 🔧 **Technical Features**  
- ✅ **TypeScript-First**: Complete type safety with strict TypeScript implementation
- ✅ **Playwright Integration**: Native Playwright test runner with enhanced fixture support
- ✅ **WebDriverIO Backend**: Robust mobile automation via WebDriverIO and Appium
- ✅ **Session Management**: Intelligent WebDriver session lifecycle and connection pooling
- ✅ **Error Handling**: Comprehensive error recovery and debugging capabilities
- ✅ **Flexible Recording**: Support for boolean and object-based recording configuration

### 📊 **Recording & Debugging**
- ✅ **Mobile Native Recording**: Appium-based screen recording for Android/iOS devices
- ✅ **Browser Video Recording**: FFmpeg-based screenshot-to-video for browser sessions
- ✅ **Automatic Screenshots**: Failure capture and manual screenshot support
- ✅ **Test Report Integration**: All media automatically attached to Playwright reports
- ✅ **Configurable Quality**: Multiple quality presets and custom CRF values for browsers
- 🔄 **Advanced Tracing**: In-progress - Full Playwright trace integration for mobile sessions

## ⚠️ Architecture Constraints

To ensure optimal integration between Playwright's test runner and WebDriverIO's mobile automation capabilities, certain architectural decisions have been made:

### 🔧 **WebDriverIO Integration Modifications**
- **Lifecycle Hooks**: WebDriverIO's native hooks (`before*`, `after*`, `on*`) are disabled to prevent conflicts with Playwright's fixture system. Use Playwright's equivalent hooks (`beforeEach`, `afterEach`, `beforeAll`, `afterAll`) instead.
- **Assertion Library**: WebDriverIO's `expect` implementation is bypassed in favor of Playwright's native assertion system for consistency and better error reporting.
- **Configuration Adapter**: WebDriverIO configuration is dynamically adapted to work within Playwright's test runner context, removing duplicate or conflicting options.

### 🎛️ **Custom Implementation Details**
- **Selector Strategy Adaptation**: WebDriverIO's selector engine is wrapped with custom methods (`locator$`, `locator$$`, `selector`, `selectors`) to provide a consistent API that integrates with Playwright's element handling.
- **Session Isolation**: Each test receives an isolated WebDriver session managed through Playwright's fixture system, ensuring proper cleanup and test independence.
- **Protocol Translation**: WebDriver protocol commands are transparently translated to work within Playwright's execution context and reporting system.

## 🛠️ System Requirements & Dependencies

### 📋 **Runtime Requirements**
- **Node.js**: Version 18.20.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher  
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+

### 📱 **Platform-Specific Setup**
This framework requires platform-specific automation tools and drivers. Follow the comprehensive setup guides:

## 📦 Installation & Setup

### 🚀 **Library Installation**
```bash
# Install the library
npm install playwright-io --save-dev

# Install Playwright test runner (peer dependency)  
npm install @playwright/test --save-dev
```

### 🔧 **Core Dependencies**
```json
{
  "peerDependencies": {
    "@playwright/test": "latest"
  },
  "dependencies": {
    "webdriverio": "latest",
    "@ffmpeg-installer/ffmpeg": "^1.1.0",
    "glob": "^11.0.3"
  }
}
```

> **📝 Note for playwright-bdd users**: When using this library with `playwright-bdd`, utilize the `mergeTests` utility to properly combine fixtures from both libraries and avoid conflicts.

## �️ Appium Setup (User Responsibility)

This library requires Appium to be installed and configured by the user. Below are the setup requirements:

### 📱 **Appium Server Installation**
```bash
# Install Appium server globally
npm install -g appium

# Install platform-specific drivers
appium driver install uiautomator2  # For Android
appium driver install xcuitest     # For iOS  
appium driver install windows      # For Windows (if needed)
```

### ✅ **Environment Verification**
```bash
# Install Appium Doctor for environment validation
npm install -g appium-doctor

# Check Android setup
appium-doctor --android

# Check iOS setup (macOS only)
appium-doctor --ios

# Verify Appium drivers
appium driver list --installed
```

### 📖 **Platform Setup Guides**

| Platform | Setup Guide | Key Requirements |
|----------|-------------|------------------|
| **Android** | [📖 Android Setup](docs/android.md) | Android Studio, SDK, ADB, JDK 11+ |
| **iOS** | [📖 iOS Setup](docs/xcode.md) | Xcode, iOS SDK, Command Line Tools |
| **Windows** | [📖 Windows Setup](docs/windows.md) | WinAppDriver, Windows SDK, Developer Mode |

## ⚙️ Configuration

### 🔧 **Playwright Configuration**
Create or update your `playwright.config.ts` file with the `TestOptions` interface for type safety:

```typescript
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
  testDir: './tests',
  timeout: 60000,
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Android Native App
    {
      name: 'Android-Native',
      use: {
        config: {
          hostname: 'localhost',
          port: 4723,
          logLevel: 'info',
          waitforTimeout: 30000,
          connectionRetryTimeout: 120000
        },
        capabilities: {
          platformName: 'Android',
          "appium:automationName": "UiAutomator2",
          "appium:platformVersion": "11.0",
          "appium:deviceName": "Android Emulator",
          "appium:app": "./apps/android-debug.apk",
          "appium:appPackage": "com.example.app",
          "appium:appActivity": ".MainActivity",
          "appium:autoGrantPermissions": true,
          "appium:newCommandTimeout": 300
        }
      }
    },
    // iOS Native App  
    {
      name: 'iOS-Native',
      use: {
        capabilities: {
          platformName: 'iOS',
          "appium:automationName": "XCUITest",
          "appium:platformVersion": "15.0",
          "appium:deviceName": "iPhone 13",
          "appium:bundleId": "com.example.app",
          "appium:udid": "your-device-udid",
          "appium:newCommandTimeout": 300,
          "appium:wdaLocalPort": 8100
        }
      }
    },
    // Mobile Browser Testing
    {
      name: 'Chrome-Android',
      use: {
        capabilities: {
          platformName: 'Android',
          "appium:automationName": "UiAutomator2",
          "appium:browserName": "Chrome",
          "appium:deviceName": "Android Emulator"
        }
      }
    }
  ]
});
```

### 📝 **Configuration Options**
| Option | Type | Description |
|--------|------|-------------|
| `config` | `object` | WebDriverIO server configuration (hostname, port, timeouts, retry settings) |
| `capabilities` | `object` | Appium capabilities defining device/app characteristics and automation settings |
| `recordingScreen` | `boolean \| RecorderOptions` | Video recording configuration - boolean for defaults or object for custom settings |
| `takeScreenshot` | `boolean` | Enable automatic screenshot capture on test failures |

### 🎬 **Video Recording Configuration**

playwright-io provides **dual recording systems** optimized for different session types:

#### 📱 **Mobile Recording (Native)**
Uses Appium's native screen recording capabilities for Android/iOS devices.

#### 🌐 **Browser Recording (FFmpeg)**  
Uses FFmpeg-based screenshot-to-video conversion for browser sessions.

**Configuration Examples:**
```typescript
export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'Android-with-Recording',
      use: {
        // Simple recording (uses defaults: mp4, medium quality, 3 minutes)
        recordingScreen: true,
        takeScreenshot: true,
        capabilities: {
          platformName: 'Android',
          "appium:automationName": "UiAutomator2",
          "appium:app": "./apps/android.apk"
        }
      }
    },
    {
      name: 'iOS-Custom-Recording',
      use: {
        // Custom recording configuration
        recordingScreen: {
          videoType: 'mp4',        // 'mp4' | 'webm' (NO 'mov' support for browser)
          quality: 'high',         // 'low' | 'medium' | 'high' | number (CRF 0-51)
          maxDuration: 600         // Duration in seconds
        },
        capabilities: {
          platformName: 'iOS',
          "appium:automationName": "XCUITest",
          "appium:bundleId": "com.example.app"
        }
      }
    },
    {
      name: 'Browser-Minimal-Recording',
      use: {
        // Minimal file size for CI/CD
        recordingScreen: {
          quality: 'low',          // Smaller files (CRF 32, 800px scale)
          maxDuration: 120         // 2 minutes max
        },
        capabilities: {
          platformName: 'Android',
          "appium:browserName": "Chrome"
        }
      }
    }
  ]
});
```

**Recording Features:**
- **Format Support**: 
  - Mobile: Any format supported by device (mp4, mov, etc.)
  - Browser: Only `'mp4'` (H.264) and `'webm'` (VP9)
- **Quality Settings**:
  - `'low'`: CRF 32, 800px scale
  - `'medium'`: CRF 23, 1280px scale (default)
  - `'high'`: CRF 18, 1920px scale
  - Custom number: CRF value 0-51 (lower = better quality)
- **Time Limits**: 1-1800 seconds (Appium requirement for mobile)
- **Automatic Attachment**: All recordings attached to Playwright reports

**Default Values:**
- `videoType`: `'mp4'`
- `quality`: `'medium'` 
- `maxDuration`: `180` seconds (3 minutes)

## 🎭 Fixture System

playwright-io extends Playwright's fixture system with mobile-specific capabilities. The library provides enhanced fixtures that seamlessly integrate WebDriverIO's mobile automation features:

### 🔧 **Enhanced Fixtures**

#### `driver` Fixture
Provides direct access to the WebDriverIO browser instance with full mobile automation capabilities:

```typescript
import { test } from 'playwright-io';

test('mobile device manipulation', async ({ driver }) => {
  // Device orientation control
  await driver.setOrientation('LANDSCAPE');
  const orientation = await driver.getOrientation();
  
  // Device information access
  const deviceTime = await driver.getDeviceTime();
  const deviceInfo = await driver.getSession();
  
  // Mobile-specific actions
  await driver.executeScript('mobile: scroll', [{ direction: 'down' }]);
  await driver.hideKeyboard();
  
  // Context switching for hybrid apps
  const contexts = await driver.getContexts();
  await driver.switchContext('WEBVIEW_1');
});
```

#### `page` Fixture  
Extended Playwright page object with mobile-aware element selection methods:

```typescript
test('cross-platform element interaction', async ({ page }) => {
  // Platform-adaptive selectors
  const loginButton = page.selector({
    android: 'android=resourceId("com.app:id/login")',
    ios: '~loginButton',
    web: '[data-testid="login-btn"]'
  });
  
  await loginButton.click();
  await expect(loginButton).toBeVisible();
});
```

## 🎯 Element Selection API

Playwright-IO provides a sophisticated element selection system that adapts to different platforms while maintaining a consistent API. The framework offers four primary selection methods:

### 🔍 **Selection Methods**

#### 1. `locator$(selector: string)`
Single element selection using standard CSS or XPath selectors:
```typescript
// CSS selector
const submitButton = page.locator$('.submit-btn');
await submitButton.click();

// XPath selector  
const dynamicElement = page.locator$('//button[contains(@text, "Submit")]');
await dynamicElement.waitForDisplayed();
```

#### 2. `locator$$(selector: string)`
Multiple element selection returning an array of WebDriver elements:
```typescript
const menuItems = page.locator$$('.menu-item');
console.log(`Found ${menuItems.length} menu items`);

// Iterate through elements
for (const item of menuItems) {
  const text = await item.getText();
  if (text.includes('Settings')) {
    await item.click();
    break;
  }
}
```

#### 3. `selector(strategy: string | SelectorStrategy)`
Platform-adaptive single element selection with cross-platform compatibility:
```typescript
// Using SelectorStrategy object for multi-platform tests
const loginField = page.selector({
  android: 'android=resourceId("com.app:id/username_field")',
  ios: '~usernameTextField', 
  web: 'input[name="username"]'
});
await loginField.setValue('testuser');

// Fallback to string selector
const genericButton = page.selector('.login-submit');
await genericButton.click();
```

#### 4. `selectors(strategy: string | SelectorStrategy)`
Platform-adaptive multiple element selection:
```typescript
const listItems = page.selectors({
  android: 'android=className("android.widget.ListView").childSelector(className("android.widget.TextView"))',
  ios: '~listCell',
  web: '.list-item'
});

// Process all found elements
for (const item of await listItems) {
  const itemText = await item.getText();
  console.log(`List item: ${itemText}`);
}
```

### 🏗️ **SelectorStrategy Interface**
```typescript
interface SelectorStrategy {
  android?: string;  // Android-specific selector (UiAutomator2)
  ios?: string;      // iOS-specific selector (XCUITest)  
  web?: string;      // Web/WebView selector (CSS/XPath)
}
```

### � **Video Recording**

playwright-io provides **dual recording systems** optimized for different session types:

#### 📱 **Mobile Recording (Native)**
Uses Appium's native screen recording capabilities for Android/iOS devices:

```typescript
export default defineConfig<TestOptions>({
  use: {
    // Simple enable (uses defaults: mp4, medium quality, 3 minutes)
    recordingScreen: true,
    
    // Custom mobile recording
    recordingScreen: {
      videoType: 'mp4',        // Format passed to Appium
      quality: 'medium',       // Passed as videoQuality to Appium  
      maxDuration: 300         // Maximum 300 seconds (5 minutes)
    }
  }
});
```

**Mobile Recording Features:**
- **Native Appium Integration**: Direct device screen capture
- **Format Support**: Any format supported by the target device
- **Quality Control**: Appium-native quality settings
- **Time Limits**: 1-1800 seconds (Appium requirement)
- **Automatic Attachment**: Videos attached to Playwright reports

#### 🌐 **Browser Recording (FFmpeg)**
Uses FFmpeg-based screenshot-to-video conversion for browser sessions:

```typescript
export default defineConfig<TestOptions>({
  use: {
    recordingScreen: {
      videoType: 'mp4',        // 'mp4' | 'webm' (NO 'mov' support)
      quality: 'high',         // 'low' | 'medium' | 'high' | number
      maxDuration: 600         // 10 minutes
    }
  }
});
```

**Browser Recording Features:**
- **FFmpeg Processing**: Screenshot capture → video conversion
- **Format Support**: 
  - `'mp4'`: H.264 encoding with libx264
  - `'webm'`: VP9 encoding with libvpx-vp9
- **Quality Settings**:
  - `'low'`: CRF 32, 800px scale
  - `'medium'`: CRF 23, 1280px scale (default)
  - `'high'`: CRF 18, 1920px scale
  - **Custom CRF**: Any number 0-51 (lower = better quality)
- **Performance**: 500ms screenshot intervals, configurable timeout

#### ⚙️ **Configuration Examples**

```typescript
// Mobile device recording
{
  name: 'Android-Native',
  use: {
    recordingScreen: {
      videoType: 'mp4',
      quality: 'medium',
      maxDuration: 180  // 3 minutes
    },
    capabilities: {
      platformName: 'Android',
      "appium:automationName": "UiAutomator2"
    }
  }
}

// Browser recording (limited formats)
{
  name: 'Chrome-Mobile',
  use: {
    recordingScreen: {
      videoType: 'webm',    // Only mp4/webm supported
      quality: 28,          // Custom CRF value
      maxDuration: 300      // 5 minutes
    },
    capabilities: {
      "appium:browserName": "Chrome"
    }
  }
}
```

**Default Values:**
- `videoType`: `'mp4'`
- `quality`: `'medium'` 
- `maxDuration`: `180` seconds (3 minutes)

## 🔧 Advanced Features

### 📱 **Context Management**
```typescript
// Handle hybrid app contexts
const contexts = await driver.getContexts();
console.log('Available contexts:', contexts);

// Switch between native and web contexts
await driver.switchContext('WEBVIEW_1');
await page.goto('https://example.com');
await driver.switchContext('NATIVE_APP');
```

### 🌐 **Network Interception**
```typescript
// Monitor network requests in mobile browsers
await page.route('**/api/**', route => {
  console.log('API Request:', route.request().url());
  route.continue();
});
```

## 📚 Additional Resources

### 📖 **Documentation**
- [🔧 Project General](docs/index.md) - Additional information general
- [📱 Utilities & Helpers](docs/utils.md) - Additional helper functions and utilities

### 🏆 **Best Practices**

#### 🎯 **General Testing**
- Use platform-specific selectors for better reliability
- Implement proper wait strategies for mobile elements
- Leverage Playwright's built-in assertions for robust tests
- Utilize screenshot and video capture for debugging

#### 🎬 **Recording Configuration**
- **Development**: Use `quality: 'high'` for detailed debugging
- **CI/CD Pipelines**: Use `quality: 'low'` for faster execution and smaller artifacts
- **Demo Videos**: Use `quality: 'high'` or custom low CRF values (0-10) for presentations
- **Long Tests**: Set appropriate `maxDuration` to avoid premature recording termination

---

**Built with ❤️ for the Playwright Community** | [GitHub](https://github.com/fromeroc9/playwright-io) | [NPM](https://www.npmjs.com/package/playwright-io)
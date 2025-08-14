# 📱 Android Setup Guide
*playwright-io Android Environment Configuration*

## 🎯 Overview

This guide covers the complete setup process for Android automation testing with playwright-io. Follow these steps to configure your development environment for Android device and emulator testing.

## 🔧 System Requirements

### **Prerequisites**
- **Node.js**: Version 18.20.0 or higher

### **Required Software**
- ✅ **Java Development Kit (JDK) 11+**: Required for Android toolchain
- ✅ **Android Studio**: IDE with Android SDK and tools
- ✅ **Android SDK**: Platform tools and build tools
- ✅ **Android Device/Emulator**: Physical device or AVD for testing

---

## 📦 Installation Process

### **Step 1: Install Java Development Kit (JDK)**

#### Windows & Linux:
```bash
# Download from Oracle or use package manager
# Verify installation
java -version
javac -version
```

#### macOS:
```bash
# Using Homebrew
brew install openjdk@11

# Verify installation  
java -version
javac -version
```

### **Step 2: Download and Install Android Studio**

1. **Download Android Studio**
   - Visit: [https://developer.android.com/studio](https://developer.android.com/studio)
   - Select your operating system
   - Accept terms and download installer

2. **Installation Process**

   #### Windows:
   ```bash
   # Run the .exe installer
   # Follow setup wizard
   # Choose "Standard" installation type
   ```

   #### macOS:
   ```bash
   # Open .dmg file
   # Drag Android Studio to Applications folder
   # Launch from Applications
   ```

   #### Linux:
   ```bash
   # Extract downloaded .zip file
   cd android-studio/bin
   ./studio.sh
   ```

### **Step 3: Configure Android SDK**

1. **Open Android Studio**
2. **Navigate to SDK Manager**:
   - `File > Settings` (Windows/Linux)
   - `Android Studio > Preferences` (macOS)
   - Go to `Appearance & Behavior > System Settings > Android SDK`

3. **Install Required SDK Components**:

   **SDK Platforms Tab:**
   - ✅ Android API 30 (Android 11.0)
   - ✅ Android API 29 (Android 10.0)
   - ✅ Android API 28 (Android 9.0)

   **SDK Tools Tab:**
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools  
   - ✅ Android SDK Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM) - Intel processors
   - ✅ Google USB Driver (Windows only)

4. **Click Apply and Accept licenses**

---

## 🌍 Environment Variables Configuration

### **Required Environment Variables**

#### Windows:
```cmd
# Add to System Environment Variables
JAVA_HOME=C:\Program Files\Java\jdk-11.0.x
ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=%ANDROID_HOME%

# Add to PATH
%JAVA_HOME%\bin
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
```

#### macOS/Linux:
```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.x.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc
```

---

## 📱 Device Configuration

### **Physical Device Setup**

1. **Enable Developer Options**:
   - Go to `Settings > About Phone`
   - Tap `Build Number` 7 times
   - Developer Options will appear in Settings

2. **Enable USB Debugging**:
   - Go to `Settings > Developer Options`
   - Enable `USB Debugging`
   - Enable `Stay Awake` (optional)

3. **Connect Device**:
   ```bash
   # Verify device connection
   adb devices
   
   # Expected output:
   # List of devices attached
   # DEVICE_ID    device
   ```

### **Android Virtual Device (AVD) Setup**

1. **Open AVD Manager**:
   - Android Studio > `Tools > AVD Manager`

2. **Create New AVD**:
   - Click `Create Virtual Device`
   - Select device definition (e.g., Pixel 4)
   - Choose system image (API 29+ recommended)
   - Configure AVD settings:
     - Name: `Playwright_Test_Device`
     - Startup size: `Cold Boot`
     - Memory: 2048 MB (minimum)

3. **Launch Emulator**:
   ```bash
   # List available AVDs
   emulator -list-avds
   
   # Start specific AVD
   emulator -avd Playwright_Test_Device
   ```

---

## ✅ Verification Process

### **Environment Verification**

```bash
# Check Java installation
java -version
# Expected: openjdk version "11.0.x" or higher

# Check Android SDK installation
adb version
# Expected: Android Debug Bridge version x.x.x

# Check connected devices
adb devices
# Expected: List of connected devices/emulators

# Check SDK tools
sdkmanager --list | head -20
# Expected: List of available/installed packages
```

### **playwright-io Integration Test**

Create a test configuration to verify setup:

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'Android-Verification',
      use: {
        capabilities: {
          platformName: 'Android',
          "appium:automationName": "UiAutomator2",
          "appium:deviceName": "Android Emulator",
          "appium:browserName": "Chrome", // For browser testing
          // OR for app testing:
          // "appium:app": "/path/to/your/app.apk",
          // "appium:appPackage": "com.example.app",
          // "appium:appActivity": ".MainActivity"
        }
      }
    }
  ]
});
```

### **Basic Test Example**

```typescript
// tests/android-verification.spec.ts
import { test, expect } from 'playwright-io';

test('Android environment verification', async ({ driver, page }) => {
  // Verify driver connection
  const session = await driver.getSession();
  console.log('Device info:', session);
  
  // For browser testing
  await driver.url('https://www.google.com');
  await expect(page.locator('input[name="q"]')).toBeVisible();
  
  // Take screenshot for verification
  await driver.saveScreenshot('./android-verification.png');
});
```

---

## 🔧 Troubleshooting

### **Common Issues and Solutions**

#### **Issue: `adb: command not found`**
```bash
# Solution: Add Android SDK to PATH
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### **Issue: Device unauthorized**
```bash
# Solution: Accept USB debugging prompt on device
# Revoke and re-authorize
adb kill-server
adb start-server
adb devices
```

#### **Issue: Emulator not starting**
```bash
# Solution: Check hardware acceleration
# Windows: Ensure Hyper-V is disabled and HAXM is installed
# Linux: Ensure KVM is installed and user is in kvm group
# macOS: Ensure Intel HAXM is installed
```

#### **Issue: Permission denied**
```bash
# Solution: Fix ADB permissions (Linux/macOS)
sudo chmod +x $ANDROID_HOME/platform-tools/adb
```

### **Performance Optimization**

```bash
# Increase emulator performance
emulator -avd Playwright_Test_Device -gpu host -memory 4096 -partition-size 2048
```

---

## 📋 Quick Reference

### **Essential ADB Commands**
```bash
# Device management
adb devices                          # List connected devices
adb connect <ip>:5555               # Connect to device over network
adb disconnect                       # Disconnect all devices

# App management  
adb install app.apk                 # Install APK
adb uninstall com.package.name      # Uninstall app
adb shell pm list packages          # List installed packages

# Device information
adb shell getprop ro.build.version.release  # Android version
adb shell getprop ro.product.model          # Device model
adb shell dumpsys window | grep mCurrentFocus  # Current activity

# Debugging
adb logcat                          # View device logs
adb shell screencap /sdcard/screen.png  # Take screenshot
adb pull /sdcard/screen.png         # Download file from device
```

### **Environment Quick Check**
```bash
# One-command verification
echo "Java: $(java -version 2>&1 | head -1)" && \
echo "ADB: $(adb version 2>&1 | head -1)" && \
echo "Devices: $(adb devices | tail -n +2)"
```

---

## 🎯 Next Steps

After completing Android setup:

1. ✅ **Install Appium**: Follow [Appium Setup Guide](appium.md)
2. ✅ **Configure playwright-io**: Set up your test project
3. ✅ **Write Your First Test**: Create Android automation tests
4. ✅ **Set Up CI/CD**: Configure automated testing pipeline

---

## 📚 Additional Resources

- [📖 Android Developer Documentation](https://developer.android.com/docs)
- [🛠️ ADB Documentation](https://developer.android.com/studio/command-line/adb)
- [🎯 UiAutomator2 Driver](https://github.com/appium/appium-uiautomator2-driver)
- [📱 Android Testing Best Practices](https://developer.android.com/training/testing)

## **Configuración de Variables de Entorno**

Para ejecutar herramientas del SDK desde la línea de comandos, debes agregarlas a las variables de entorno.

### **1. Localizar la Ruta del SDK**

- En Android Studio, ve a **File > Settings (Preferences en macOS) > Appearance & Behavior > System Settings > Android SDK**.
- Anota la ruta del Android SDK (ejemplo: `/Users/tuusuario/Library/Android/sdk`).

### **2. Configurar Variables de Entorno**

#### **Windows:**
1. Haz clic derecho en `Este PC` o `Equipo` y selecciona `Propiedades`.
2. Ve a `Configuración avanzada del sistema` y haz clic en `Variables de entorno`.
3. En `Variables del sistema`, haz clic en `Nueva` y añade:
   - **Nombre de la variable**: `ANDROID_HOME`
   - **Valor de la variable**: Ruta del Android SDK
4. Agrega las siguientes rutas a la variable `Path`:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`

#### **macOS/Linux:**
1. Abre una terminal y edita el archivo `~/.bash_profile`, `~/.zshrc` o `~/.bashrc`:
   ```sh
   export ANDROID_HOME=~/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   ```
2. Guarda y aplica los cambios ejecutando:
   ```sh
   source ~/.bash_profile
   ```

---
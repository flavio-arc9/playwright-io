# 🪟 Windows Setup Guide
*playwright-io Windows Environment Configuration*

## 🎯 Overview

This comprehensive guide covers the complete setup process for Windows automation testing with playwright-io. Configure your Windows development environment for Windows application and browser testing.

## 🔧 System Requirements

### **Required Software**
- ✅ **Node.js**: Version 18.20.0 or higher
- ✅ **PowerShell**: Version 5.1 or higher (Windows PowerShell or PowerShell Core)
- ✅ **Visual Studio Redistributable**: For native app testing
- ✅ **Windows Application Driver (WinAppDriver)**: For Windows app automation

---

## 📦 Installation Process

### **Step 1: Install Node.js**

#### **Method 1: Official Installer (Recommended)**
1. Visit [Node.js Downloads](https://nodejs.org/en/download/)
2. Download Windows Installer (.msi) for x64
3. Run installer with administrator privileges
4. Select "Add to PATH" option
5. Verify installation:

```powershell
# Verify Node.js installation
node --version
# Expected: v18.20.0 or higher

npm --version
# Expected: 9.x.x or higher
```

#### **Method 2: Package Manager**
```powershell
# Using Chocolatey
choco install nodejs

# Using Winget
winget install OpenJS.NodeJS

# Using Scoop
scoop install nodejs
```

### **Step 2: Install Windows Application Driver (WinAppDriver)**

#### **Download and Install WinAppDriver**
1. Visit [WinAppDriver Releases](https://github.com/Microsoft/WinAppDriver/releases)
2. Download latest `WindowsApplicationDriver.msi`
3. Run installer as Administrator
4. Default installation path: `C:\Program Files (x86)\Windows Application Driver\`

#### **Verify WinAppDriver Installation**
```powershell
# Check if WinAppDriver is installed
Get-ChildItem "C:\Program Files (x86)\Windows Application Driver\"

# Start WinAppDriver manually (for testing)
& "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"
# Should start on http://127.0.0.1:4723/
```

### **Step 3: Enable Developer Mode**

Windows automation requires Developer Mode to be enabled:

1. **Open Settings**: `Windows Key + I`
2. **Go to Update & Security**: Click on "Update & Security"
3. **Select For developers**: Click on "For developers" in left panel
4. **Enable Developer mode**: Toggle "Developer Mode" to On
5. **Restart if prompted**

#### **Verify Developer Mode via PowerShell**
```powershell
# Check if Developer Mode is enabled
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense"

# Should return: AllowDevelopmentWithoutDevLicense : 1
```

### **Step 4: Install Visual Studio Redistributable**

Required for some Windows applications:

```powershell
# Download and install Visual C++ Redistributable
# Visit: https://aka.ms/vs/17/release/vc_redist.x64.exe

# Or use package manager
choco install vcredist2019

# Verify installation
Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -like "*Visual C++*"}
```

---

## 🌍 Environment Variables Configuration

### **Required Environment Variables**

```powershell
# Add WinAppDriver to PATH (if not automatically added)
$env:PATH += ";C:\Program Files (x86)\Windows Application Driver\"

# Verify WinAppDriver in PATH
Get-Command WinAppDriver.exe

# Optional: Set JAVA_HOME for additional tools
$env:JAVA_HOME = "C:\Program Files\Java\jdk-11.0.x"
$env:PATH += ";$env:JAVA_HOME\bin"
```

### **Permanent Environment Variables**

```powershell
# Set permanent environment variables
[Environment]::SetEnvironmentVariable("WINAPPDDRIVER_PATH", "C:\Program Files (x86)\Windows Application Driver\", "Machine")

# Add to PATH permanently
$oldPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
$newPath = "$oldPath;C:\Program Files (x86)\Windows Application Driver\"
[Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
```

---

## 🖥️ Windows Application Configuration

### **Built-in Windows Apps**

Windows comes with several built-in apps perfect for testing:

#### **Calculator Application**
```typescript
// playwright.config.ts - Calculator testing
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
  projects: [
    {
      name: 'Windows-Calculator',
      use: {
        capabilities: {
          platformName: 'Windows',
          "appium:automationName": "Windows",
          "appium:deviceName": "WindowsPC",
          "appium:app": "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App"
        }
      }
    }
  ]
});
```

#### **Notepad Application**
```typescript
// Notepad testing configuration
{
  name: 'Windows-Notepad',
  use: {
    capabilities: {
      platformName: 'Windows',
      "appium:automationName": "Windows", 
      "appium:deviceName": "WindowsPC",
      "appium:app": "C:\\Windows\\System32\\notepad.exe"
    }
  }
}
```

---

## ✅ Verification Process

### **Environment Verification**

```powershell
# Comprehensive environment check
Write-Host "=== Windows Testing Environment Check ==="

# Node.js version
Write-Host "Node.js: $(node --version)"
Write-Host "NPM: $(npm --version)"

# Appium installation
try {
    $appiumVersion = appium --version
    Write-Host "Appium: $appiumVersion"
} catch {
    Write-Host "Appium: Not installed"
}

# WinAppDriver installation
if (Test-Path "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe") {
    Write-Host "WinAppDriver: ✅ Installed"
} else {
    Write-Host "WinAppDriver: ❌ Not found"
}

# Developer Mode check
$devMode = Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -ErrorAction SilentlyContinue
if ($devMode.AllowDevelopmentWithoutDevLicense -eq 1) {
    Write-Host "Developer Mode: ✅ Enabled"
} else {
    Write-Host "Developer Mode: ❌ Disabled"
}

# Windows version
$winVersion = Get-ComputerInfo | Select-Object WindowsProductName, WindowsVersion
Write-Host "Windows: $($winVersion.WindowsProductName) ($($winVersion.WindowsVersion))"
```

### **playwright-io Integration Test**

```typescript
// tests/windows-verification.spec.ts
import { test, expect } from 'playwright-io';

test.describe('Windows Environment Verification', () => {
  test('Calculator app automation test', async ({ driver, page }) => {
    // Verify driver connection
    const session = await driver.getSession();
    expect(session).toBeDefined();
    
    console.log('Windows session created:', session.id);
    console.log('App capabilities:', session.capabilities);
    
    // Basic calculator operations
    await page.locator('[Name="Two"]').click();
    await page.locator('[Name="Plus"]').click();
    await page.locator('[Name="Three"]').click();
    await page.locator('[Name="Equals"]').click();
    
    // Verify result
    const result = await page.locator('[AutomationId="CalculatorResults"]');
    await expect(result).toContainText('5');
    
    console.log('Calculator test completed successfully');
  });
});
```

---

## 🔧 Troubleshooting

### **Common Installation Issues**

#### **Issue: WinAppDriver not starting**
```powershell
# Solution 1: Check if service is already running
Get-Process -Name "WinAppDriver" -ErrorAction SilentlyContinue

# Solution 2: Run as Administrator
Start-Process "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" -Verb RunAs

# Solution 3: Check firewall settings
New-NetFirewallRule -DisplayName "WinAppDriver" -Direction Inbound -Program "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe" -Action Allow
```

#### **Issue: Developer Mode not enabling**
```powershell
# Solution: Enable via Registry (requires admin)
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -Value 1

# Restart required after registry change
```

---

## 📋 Quick Reference

### **Essential Windows Commands**
```powershell
# Application management
Get-StartApps                                    # List all apps
Get-AppxPackage                                  # List UWP packages
Get-Process | Where {$_.MainWindowTitle -ne ""} # List running apps with windows

# WinAppDriver management
Start-Process "C:\Program Files (x86)\Windows Application Driver\WinAppDriver.exe"  # Start WinAppDriver
Get-Process -Name "WinAppDriver"                 # Check if running
Stop-Process -Name "WinAppDriver" -Force         # Stop WinAppDriver

# Environment verification
node --version                                   # Node.js version
npm --version                                   # NPM version
appium --version                                # Appium version
Get-ComputerInfo | Select WindowsProductName    # Windows version
```

---

## 🎯 Next Steps

After completing Windows setup:

1. ✅ **Install playwright-io**: Set up your test project
2. ✅ **Configure Test Environment**: Create Windows-specific test configurations
3. ✅ **Write Your First Test**: Start automating Windows applications
4. ✅ **Explore Windows Apps**: Test both UWP and traditional desktop applications

---

## 📚 Additional Resources

- [📖 WinAppDriver Documentation](https://github.com/microsoft/WinAppDriver)
- [🛠️ Windows App Development](https://docs.microsoft.com/en-us/windows/apps/)
- [🎯 UI Automation API](https://docs.microsoft.com/en-us/windows/win32/winauto/entry-uiauto-win32)
- [📱 Universal Windows Platform](https://docs.microsoft.com/en-us/windows/uwp/)
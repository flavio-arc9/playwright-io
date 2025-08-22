# 🎭 Extended Fixtures

The extended fixtures from playwright-io provide direct access to mobile functionalities and additional methods.

---

### driver

Direct access to the WebDriverIO instance with complete mobile capabilities:

```ts
test('Device control', async ({ driver }) => {
    // Orientation control
    await driver.setOrientation('LANDSCAPE');
    const orientation = await driver.getOrientation();
    
    // Device information
    const deviceTime = await driver.getDeviceTime();
    const session = await driver.getSession();
    
    // Mobile-specific actions
    await driver.executeScript('mobile: scroll', [{ direction: 'down' }]);
    await driver.hideKeyboard();
    
    // Context switching in hybrid apps
    const contexts = await driver.getContexts();
    await driver.switchContext('WEBVIEW_1');
});
```

**Key features:**
- ✅ **Device control** - Orientation, keyboard, background
- ✅ **Hybrid contexts** - Switch between native and webview
- ✅ **Device information** - Time, session, capabilities
- ✅ **Mobile actions** - Scroll, gestures, specific commands

### Extended page

Playwright Page extended with WebDriverIO methods:

```ts
test('Extended page', async ({ page }) => {
    // Native Playwright methods
    await page.goto('https://example.com');
    
    // Added WebDriverIO methods
    const element = await page.locator$('#button');
    const elements = await page.locator$$('.items');
    
    // Cross-platform selectors
    const platformElement = await page.selector({
        android: '//android.widget.Button[@text="Login"]',
        ios: '//XCUIElementTypeButton[@name="Login"]',
        web: '#login-button'
    });
    
    // Wait with conditions
    const waitedElement = await page.waitForElement('#dynamic-content', {
        timeout: 10000,
        visible: true,
        enabled: true
    });
    
    // Access to WebDriverIO context
    const driver = page.io;
    await driver.background(3);
});
```

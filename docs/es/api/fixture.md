# 🎭 Fixtures Extendidas

Las fixtures extendidas de playwright-io proporcionan acceso directo a funcionalidades móviles y métodos adicionales.

---

### driver

Acceso directo a la instancia de WebDriverIO con capacidades móviles completas:

```ts
test('Control de dispositivo', async ({ driver }) => {
    // Control de orientación
    await driver.setOrientation('LANDSCAPE');
    const orientation = await driver.getOrientation();
    
    // Información del dispositivo
    const deviceTime = await driver.getDeviceTime();
    const session = await driver.getSession();
    
    // Acciones específicas móviles
    await driver.executeScript('mobile: scroll', [{ direction: 'down' }]);
    await driver.hideKeyboard();
    
    // Cambio de contexto en apps híbridas
    const contexts = await driver.getContexts();
    await driver.switchContext('WEBVIEW_1');
});
```

**Características principales:**
- ✅ **Control de dispositivo** - Orientación, teclado, fondo
- ✅ **Contextos híbridos** - Cambio entre nativo y webview
- ✅ **Información del dispositivo** - Tiempo, sesión, capacidades
- ✅ **Acciones móviles** - Scroll, gestos, comandos específicos

### page Extendida

Page de Playwright extendida con métodos de WebDriverIO:

```ts
test('Page extendida', async ({ page }) => {
    // Métodos de Playwright nativos
    await page.goto('https://ejemplo.com');
    
    // Métodos WebDriverIO agregados
    const element = await page.locator$('#button');
    const elements = await page.locator$$('.items');
    
    // Selectores multiplataforma
    const platformElement = await page.selector({
        android: '//android.widget.Button[@text="Login"]',
        ios: '//XCUIElementTypeButton[@name="Login"]',
        web: '#login-button'
    });
    
    // Espera con condiciones
    const waitedElement = await page.waitForElement('#dynamic-content', {
        timeout: 10000,
        visible: true,
        enabled: true
    });
    
    // Acceso al contexto WebDriverIO
    const driver = page.io;
    await driver.background(3);
});
```

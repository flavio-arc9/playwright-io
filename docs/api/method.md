# 🔧 Métodos

Esta sección documenta todos los métodos disponibles en playwright-io.

--- 

### locator$(selector)
Encuentra un elemento usando sintaxis de WebDriverIO:

```ts
const element = await page.locator$('#button');
await element.click();
```

**Parámetros:**
- `selector` - Selector CSS, XPath o texto

**Retorna:** WebDriverIO Element

### locator$$(selector)
Encuentra múltiples elementos:

```ts
const elements = await page.locator$$('.list-item');
console.log(`Found ${elements.length} items`);
```

**Parámetros:**
- `selector` - Selector CSS, XPath o texto

**Retorna:** Array de WebDriverIO Elements

### selector(locator)
Encuentra elemento con selectores multiplataforma:

```ts
const button = await page.selector({
    android: '//android.widget.Button[@text="Submit"]',
    ios: '//XCUIElementTypeButton[@name="Submit"]',
    web: 'button[type="submit"]'
});
```

**Parámetros:**
- `locator` - String selector o objeto Selector con selectores específicos por plataforma

**Retorna:** WebDriverIO Element resuelto para la plataforma actual

### selectors(locator)
Encuentra múltiples elementos multiplataforma:

```ts
const items = await page.selectors({
    android: '//android.widget.TextView[@resource-id="item"]',
    ios: '//XCUIElementTypeStaticText[@name="item"]',
    web: '.item-text'
});
```

**Parámetros:**
- `locator` - String selector o objeto Selector con selectores específicos por plataforma

**Retorna:** Array de WebDriverIO Elements

### element(selector)
Encuentra un elemento usando selectores multiplataforma (alias de `selector`):

```ts
const button = await page.element('.submit-button');

// Con selectores específicos por plataforma
const button = await page.element({
    android: '//android.widget.Button[@text="Submit"]',
    ios: '//XCUIElementTypeButton[@name="Submit"]',
    web: 'button[type="submit"]'
});
```

**Parámetros:**
- `selector` - String selector o objeto Selector con selectores específicos por plataforma

**Retorna:** WebDriverIO Element

### elements(selector)
Encuentra múltiples elementos usando selectores multiplataforma (alias de `selectors`):

```ts
const buttons = await page.elements('.btn');

// Con selectores específicos por plataforma
const listItems = await page.elements({
    android: '//android.widget.TextView[@resource-id="item"]',
    ios: '//XCUIElementTypeStaticText[@name="item"]',
    web: '.item-text'
});
```

**Parámetros:**
- `selector` - String selector o objeto Selector con selectores específicos por plataforma

**Retorna:** Array de WebDriverIO Elements

### waitForElement(locator, options)
Espera elemento con condiciones específicas:

```ts
const element = await page.waitForElement('#loading', {
    timeout: 15000,
    visible: true,
    enabled: true
});

// Con selectores multiplataforma
const button = await page.waitForElement({
    android: '//android.widget.Button[@text="Continue"]',
    ios: '//XCUIElementTypeButton[@name="Continue"]',
    web: 'button[data-testid="continue"]'
}, {
    timeout: 10000,
    visible: true
});
```

**Parámetros:**
- `locator` - String selector o objeto Selector multiplataforma
- `options` - Opciones de espera:
  - `timeout?: number` - Tiempo máximo de espera en milisegundos (default: 5000)
  - `visible?: boolean` - Si el elemento debe ser visible (default: false)
  - `enabled?: boolean` - Si el elemento debe estar habilitado (default: false)

**Retorna:** WebDriverIO Element cuando se cumplan las condiciones

###`io
Acceso directo al contexto WebDriverIO:

```ts
// Acceso al driver desde page
const driver = page.io;
await driver.pressKeyCode(4); // Botón atrás en Android
await driver.background(3); // Enviar app al fondo por 3 segundos
```

**Retorna:** Instancia del driver WebDriverIO (Context)
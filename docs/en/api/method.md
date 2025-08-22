# 🔧 Methods

This section documents all available methods in playwright-io.

--- 

### locator$(selector)
Finds an element using WebDriverIO syntax:

```ts
const element = await page.locator$('#button');
await element.click();
```

**Parameters:**
- `selector` - CSS, XPath or text selector

**Returns:** WebDriverIO Element

### locator$$(selector)
Finds multiple elements:

```ts
const elements = await page.locator$$('.list-item');
console.log(`Found ${elements.length} items`);
```

**Parameters:**
- `selector` - CSS, XPath or text selector

**Returns:** Array of WebDriverIO Elements

### selector(locator)
Finds element with cross-platform selectors:

```ts
const button = await page.selector({
    android: '//android.widget.Button[@text="Submit"]',
    ios: '//XCUIElementTypeButton[@name="Submit"]',
    web: 'button[type="submit"]'
});
```

**Parameters:**
- `locator` - String selector or Selector object with platform-specific selectors

**Returns:** WebDriverIO Element resolved for current platform

### selectors(locator)
Finds multiple cross-platform elements:

```ts
const items = await page.selectors({
    android: '//android.widget.TextView[@resource-id="item"]',
    ios: '//XCUIElementTypeStaticText[@name="item"]',
    web: '.item-text'
});
```

**Parameters:**
- `locator` - String selector or Selector object with platform-specific selectors

**Returns:** Array of WebDriverIO Elements

### element(selector)
Finds an element using cross-platform selectors (alias for `selector`):

```ts
const button = await page.element('.submit-button');

// With platform-specific selectors
const button = await page.element({
    android: '//android.widget.Button[@text="Submit"]',
    ios: '//XCUIElementTypeButton[@name="Submit"]',
    web: 'button[type="submit"]'
});
```

**Parameters:**
- `selector` - String selector or Selector object with platform-specific selectors

**Returns:** WebDriverIO Element

### elements(selector)
Finds multiple elements using cross-platform selectors (alias for `selectors`):

```ts
const buttons = await page.elements('.btn');

// With platform-specific selectors
const listItems = await page.elements({
    android: '//android.widget.TextView[@resource-id="item"]',
    ios: '//XCUIElementTypeStaticText[@name="item"]',
    web: '.item-text'
});
```

**Parameters:**
- `selector` - String selector or Selector object with platform-specific selectors

**Returns:** Array of WebDriverIO Elements

### waitForElement(locator, options)
Waits for element with specific conditions:

```ts
const element = await page.waitForElement('#loading', {
    timeout: 15000,
    visible: true,
    enabled: true
});

// With cross-platform selectors
const button = await page.waitForElement({
    android: '//android.widget.Button[@text="Continue"]',
    ios: '//XCUIElementTypeButton[@name="Continue"]',
    web: 'button[data-testid="continue"]'
}, {
    timeout: 10000,
    visible: true
});
```

**Parameters:**
- `locator` - String selector or cross-platform Selector object
- `options` - Wait options:
  - `timeout?: number` - Maximum wait time in milliseconds (default: 5000)
  - `visible?: boolean` - Whether element should be visible (default: false)
  - `enabled?: boolean` - Whether element should be enabled (default: false)

**Returns:** WebDriverIO Element when conditions are met

### io
Direct access to WebDriverIO context:

```ts
// Access driver from page
const driver = page.io;
await driver.pressKeyCode(4); // Back button on Android
await driver.background(3); // Send app to background for 3 seconds
```

**Returns:** WebDriverIO driver instance (Context)
# 📖 API Reference

This guide documents all available APIs in **playwright-io** for mobile automation.

---

## 🌐 Global Driver

The WebDriverIO driver is available globally without needing imports:

```ts
// Available automatically in any test
test('My mobile test', async () => {
    await driver.url('myapp://main');
    await driver.$('#button').click();
    
    const text = await driver.$('#result').getText();
    expect(text).toBe('Success');
});
```

**Features:**
- ✅ **Global access** - No import required
- ✅ **Type safety** - Complete TypeScript typing
- ✅ **Automatic cleanup** - Managed between tests
- ✅ **Thread safe** - Each worker has its own instance

---

## 📚 API Sections

- **[🎭 Fixtures](en/api/fixture.md)** - Extended fixtures (`driver`, `page`)
- **[🔧 Methods](en/api/method.md)** - Available methods and utilities


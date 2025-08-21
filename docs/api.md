# 📖 API Reference

Esta guía documenta todas las APIs disponibles en **playwright-io** para automatización móvil.

La documentación está organizada en las siguientes secciones:

---

## 📚 Secciones de la API

### **[🌐 Introducción y Driver Global](api/index.md)**
- Variable global `driver`
- Características principales
- Acceso thread-safe

### **[🎭 Fixtures Extendidas](api/fixture.md)**
- `driver` Fixture - Control de dispositivo móvil
- `page` Fixture Extendida - Page con métodos WebDriverIO

### **[🔧 Métodos y Utilidades](api/method.md)**
- Métodos de Page extendida
- Selector API multiplataforma
- Utilidades de espera y resolución

---

## 🚀 Inicio Rápido

```ts
// Usar driver global
test('Test con driver global', async () => {
    await driver.$('#button').click();
});

// Usar fixtures extendidas
test('Test con fixtures', async ({ page, driver }) => {
    const element = await page.selector({
        android: '//android.widget.Button',
        ios: '//XCUIElementTypeButton'
    });
    await element.click();
});
```


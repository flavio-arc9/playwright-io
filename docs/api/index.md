# 📖 API Reference

Esta guía documenta todas las APIs disponibles en **playwright-io** para automatización móvil.

---

## 🌐 Driver Global

El driver de WebDriverIO está disponible globalmente sin necesidad de importación:

```ts
// Disponible automáticamente en cualquier test
test('Mi test móvil', async () => {
    await driver.url('myapp://main');
    await driver.$('#button').click();
    
    const text = await driver.$('#result').getText();
    expect(text).toBe('Éxito');
});
```

**Características:**
- ✅ **Acceso global** - No requiere importación
- ✅ **Type safety** - Tipado completo de TypeScript
- ✅ **Limpieza automática** - Se gestiona entre tests
- ✅ **Thread safe** - Cada worker tiene su propia instancia

---

## 📚 Secciones de la API

- **[🎭 Fixtures](api/fixture.md)** - Fixtures extendidas (`driver`, `page`)
- **[🔧 Métodos](api/method.md)** - Métodos y utilidades disponibles


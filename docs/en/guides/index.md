# 📚 Guías

Aprende a usar **playwright-io** con guías prácticas, ejemplos y mejores prácticas.

---

> Proximamente!!

<!-- 
## 🚀 Guías Básicas

### **[📱 Configurar tu primer test móvil](../getting-started/write-first-test.md)**
Crea y ejecuta tu primer test de automatización móvil con Android o iOS.

### **[⚙️ Configuración avanzada](../configuration/index.md)**
Optimiza tu configuración con projects, capabilities y opciones específicas.

### **[🔧 Usar fixtures extendidas](../getting-started/add-fixtures.md)**
Aprende a usar las fixtures `driver` y `page` para tests más eficientes.

---

## 🎯 Guías Avanzadas

### **🔄 Ejecución Paralela**
Configura y optimiza tests paralelos para máximo rendimiento.

```typescript
// playwright.config.ts
export default defineConfig({
  workers: 4,           // 4 tests en paralelo
  fullyParallel: true,  // Paralelismo completo
  projects: [
    { name: 'android', use: { /* ... */ } },
    { name: 'ios', use: { /* ... */ } }
  ]
});
```

### **📱 Selectores Multiplataforma**
Escribe tests que funcionen en Android, iOS y Web sin duplicar código.

```typescript
test('botón multiplataforma', async ({ page }) => {
  const button = await page.selector({
    android: '//android.widget.Button[@text="Login"]',
    ios: '//XCUIElementTypeButton[@name="Login"]',
    web: '#login-button'
  });
  await button.click();
});
```

### **🎥 Grabación y Screenshots**
Configura grabación automática y capturas para debugging efectivo.

```typescript
use: {
  recordingScreen: {
    videoType: 'mp4',
    quality: 'medium'
  },
  takeScreenshot: true
}
```

---

## 🛠️ Ejemplos Prácticos

### **📋 Casos de Uso Comunes**

#### **Formularios y Login**
```typescript
test('login flow', async () => {
  await driver.$('~username').setValue('usuario@test.com');
  await driver.$('~password').setValue('password123');
  await driver.$('~login-button').click();
  
  // Verificar login exitoso
  await expect(driver.$('~welcome-message')).toBeDisplayed();
});
```

#### **Navegación y Gestos**
```typescript
test('navegación con gestos', async () => {
  // Scroll hacia abajo
  await driver.executeScript('mobile: scroll', [{ direction: 'down' }]);
  
  // Swipe horizontal
  await driver.executeScript('mobile: swipe', [{ 
    startX: 300, startY: 500, 
    endX: 100, endY: 500 
  }]);
});
```

#### **Cambio de Contexto (Apps Híbridas)**
```typescript
test('webview interaction', async () => {
  // Cambiar a contexto web
  await driver.switchContext('WEBVIEW_1');
  await driver.$('#web-button').click();
  
  // Volver a contexto nativo
  await driver.switchContext('NATIVE_APP');
  await driver.$('~native-button').click();
});
```

---

## 🎨 Mejores Prácticas

### **✅ Hacer**
- Usar selectores estables (accessibility id, resource-id)
- Implementar esperas explícitas con `waitForElement`
- Organizar tests en Page Objects
- Usar selectores multiplataforma para código reutilizable
- Configurar timeouts apropiados para tu app

### **❌ Evitar**
- Selectores frágiles basados en texto dinámico
- Sleeps/waits fijos (`sleep(5000)`)
- Tests que dependen del orden de ejecución
- Capabilities hardcodeadas en tests
- Screenshots/videos innecesarios en todos los tests

---

## 📖 Recursos Adicionales

### **📋 Enlaces Útiles**
- **[🔧 API Reference](../api/index.md)** - Documentación completa de métodos
- **[⚙️ Configuración](../configuration/index.md)** - Opciones y capabilities
- **[🔄 Migración](../migration.md)** - Migrar desde otros frameworks
- **[📱 Prerrequisitos](../prerequisites/index.md)** - Configurar Appium y dispositivos

### **💡 Ejemplos Completos**
- **[GitHub Examples](https://github.com/flavio-arc9/playwright-io-examples)** - Repositorio con ejemplos reales
- **[Test Patterns](https://github.com/flavio-arc9/playwright-io-examples/tree/main/tests)** - Patrones de testing comunes

### **🆘 Soporte**
- **[GitHub Issues](https://github.com/flavio-arc9/playwright-io/issues)** - Reportar bugs
- **[Discussions](https://github.com/flavio-arc9/playwright-io/discussions)** - Preguntas y ayuda
- **[Changelog](../changelog)** - Novedades y cambios

---

## 🎯 Próximas Guías

Estamos trabajando en más guías detalladas:

- 🔄 **CI/CD Integration** - Jenkins, GitHub Actions, Azure DevOps
- 📊 **Advanced Reporting** - Reportes personalizados y métricas
- 🧪 **Testing Strategies** - Smoke tests, regression, performance
- 📱 **Device Farms** - BrowserStack, Sauce Labs, AWS Device Farm
- 🔍 **Debugging Techniques** - Logs, network monitoring, performance

¿Tienes sugerencias para nuevas guías? [¡Compártelas con nosotros!](https://github.com/flavio-arc9/playwright-io/discussions) -->
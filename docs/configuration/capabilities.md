
# Capabilities de Appium

Las **capabilities** son configuraciones que definen las características del dispositivo y la aplicación que queremos automatizar. Son **obligatorias** para establecer la conexión con el dispositivo.

> **📱 Obtención de datos:** Para obtener los valores correctos de UDID, appPackage, bundleId, etc., consulta la guía de [**Inspección de Dispositivos**](../prerequisites/device.md).

---

## 🤖 Android Capabilities

### Capabilities Esenciales

```ts
capabilities: {
    platformName: 'Android',
    "appium:automationName": "UiAutomator2",        // Driver de automatización
    "appium:deviceName": "Mi Dispositivo Android",  // Nombre descriptivo
    "appium:udid": "DEVICE_ID_AQUI",                // ID único del dispositivo
    "appium:appPackage": "com.ejemplo.app",         // Package de la aplicación
    "appium:appActivity": ".MainActivity"           // Activity principal
}
```

### Capabilities Opcionales

```ts
capabilities: {
    // ... capabilities esenciales
    "appium:platformVersion": "13.0",               // Versión de Android
    "appium:noReset": true,                         // No resetear app entre tests
    "appium:fullReset": false,                      // No reinstalar la app
    "appium:autoGrantPermissions": true,            // Otorgar permisos automáticamente
    "appium:unicodeKeyboard": true,                 // Habilitar teclado Unicode
    "appium:resetKeyboard": true                    // Ocultar teclado después del test
}
```

---

## 🍎 iOS Capabilities

### Capabilities Esenciales

```ts
capabilities: {
    platformName: 'iOS',
    "appium:automationName": "XCUITest",            // Driver de automatización
    "appium:deviceName": "iPhone 15 Pro",          // Nombre descriptivo
    "appium:udid": "SIMULATOR_OR_DEVICE_ID",       // ID único del dispositivo/simulador
    "appium:bundleId": "com.ejemplo.app"           // Bundle ID de la aplicación
}
```

### Capabilities Opcionales

```ts
capabilities: {
    // ... capabilities esenciales
    "appium:platformVersion": "17.0",               // Versión de iOS
    "appium:noReset": true,                         // No resetear app entre tests
    "appium:fullReset": false,                      // No reinstalar la app
    "appium:autoAcceptAlerts": true,                // Aceptar alertas automáticamente
}
```

---

## 🚗 Automation Names (Drivers)

El `automationName` define qué **driver de Appium** se utilizará para la automatización:

### Android Drivers

| Automation Name | Descripción | Uso Recomendado |
|-----------------|-------------|-----------------|
| `UiAutomator2` | Driver moderno para Android (API 16+) | ✅ **Recomendado** para apps nativas |
| `Espresso` | Driver basado en Google Espresso | 🎯 Apps con soporte específico de Espresso |

### iOS Drivers

| Automation Name | Descripción | Uso Recomendado |
|-----------------|-------------|-----------------|
| `XCUITest` | Driver moderno para iOS (iOS 9.3+) | ✅ **Recomendado** para apps nativas |
| `UIAutomation` | Driver legacy (deprecated) | ❌ No recomendado |

> **📖 Documentación completa:** Para ver todos los drivers disponibles y sus opciones específicas, consulta la [documentación oficial de Appium](https://appium.io/docs/en/2.5/ecosystem/drivers/).

---

## 🎯 Propósito de las Capabilities

### Capabilities de Identificación
- **`platformName`**: Define la plataforma (Android/iOS)
- **`deviceName`**: Nombre descriptivo para identificar el dispositivo en reportes
- **`udid`**: Identificador único que especifica exactamente qué dispositivo usar

### Capabilities de Aplicación
- **`appPackage`/`bundleId`**: Identifica qué aplicación abrir
- **`appActivity`**: Especifica la pantalla inicial de la app (Android)
- **`app`**: Ruta al archivo .apk/.ipa para instalar

### Capabilities de Comportamiento
- **`noReset`**: Mantiene el estado de la app entre tests
- **`fullReset`**: Reinstala completamente la app
- **`autoGrantPermissions`**: Acepta permisos automáticamente (Android)
- **`autoAcceptAlerts`**: Acepta alertas automáticamente (iOS)
- **`unicodeKeyboard`**: Habilita teclado Unicode para caracteres especiales (Android)
- **`resetKeyboard`**: Restaura el teclado original después del test (Android)

## 📚 Referencias

- **[📱 Inspección de Dispositivos](prerequisites/device.md)** - Cómo obtener UDIDs, appPackage, bundleId
- **[🔧 Configuración de Proyectos](configuration/projects.md)** - Usar capabilities en playwright.config.ts
- **[📖 Documentación de Appium](https://appium.io/docs/en/2.0/guides/caps/)** - Capabilities completas de Appium
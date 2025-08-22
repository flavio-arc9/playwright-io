# 🚀 Configuración Appium 2

Appium 2 es el servidor de automatización que permite controlar dispositivos móviles y es la base fundamental para Playwright-IO.

---

## 🔧 Instalación de Appium 2

### 1. Instalar Appium 2 Globalmente

```bash
# Instalar Appium 2 (versión más reciente)
npm install -g appium@next

# Verificar instalación
appium --version
```

### 2. Instalar Drivers Necesarios

Appium 2 requiere la instalación manual de drivers específicos:

```bash
# Driver para Android
appium driver install uiautomator2

# Driver para iOS (solo en macOS)
appium driver install xcuitest
```

### 3. Verificar Drivers Instalados

```bash
# Listar todos los drivers disponibles
appium driver list

# Listar solo drivers instalados
appium driver list --installed
```

## ✅ Verificación de Instalación

Confirme que Appium 2 está funcionando correctamente:

```bash
# Verificar versión de Appium
appium --version

# Iniciar servidor Appium (para prueba)
appium server

# Detener con Ctrl+C
```

## 🔍 Herramientas Adicionales (Opcional)

### Appium Inspector
Para inspeccionar elementos de aplicaciones móviles:

- Visite [Appium Releases](https://github.com/appium/appium-inspector/releases)
- Descargue la versión más reciente para su sistema operativo:
  - **macOS:** `Appium-Inspector-xxx-mac.dmg`
  - **Windows:** `Appium-Inspector-xxx-win.exe`
  - **Linux:** `Appium-Inspector-xxx-linux.AppImage`


### Appium Doctor
Para verificar la configuración del entorno:

```bash
# Instalar Appium Doctor
npm install -g appium-doctor

# Verificar configuración Android
appium-doctor --android

# Verificar configuración iOS (solo macOS)
appium-doctor --ios
```

## 🚀 Siguientes Pasos

Una vez completada la instalación de Appium 2:

- **[🤖 Configurar Android](es/prerequisites/android.md)** - Configurar Android SDK y dispositivos
- **[🍎 Configurar iOS](es/prerequisites/ios.md)** - Configurar Xcode y dispositivos iOS
- **[📦 Instalar Playwright-IO](es/getting-started/installation.md)** - Instalar el paquete principal

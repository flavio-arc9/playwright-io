# 🍎 Configuración iOS

Esta guía le ayudará a configurar su entorno para pruebas automatizadas en dispositivos iOS.

---

> ⚠️ **Importante:** Las pruebas en iOS solo están disponibles en macOS.

## 🛠️ Instalación de Xcode

### 1. Instalar Xcode

```bash
# Opción 1: Desde App Store (recomendado)
# Buscar "Xcode" en App Store e instalar

# Opción 2: Desde línea de comandos
xcode-select --install
```

### 2. Configurar Command Line Tools

```bash
# Instalar herramientas de línea de comandos
sudo xcode-select --install

# Verificar instalación
xcode-select -p
```

## 🚀 Siguiente Paso

Una vez completada la configuración iOS:

- **[📦 Instalar Playwright-IO](getting-started/installation.md)** - Instalar el paquete principal
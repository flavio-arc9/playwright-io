# 🔍 Inspección de Dispositivos y Aplicaciones

Esta guía le ayudará a obtener la información esencial para automatización móvil: **UDID**, **appPackage**, **appActivity** (Android) y **bundleId** (iOS).

---

## 📱 Android

> ⚠️ **Múltiples Dispositivos:** Si tienes varios dispositivos conectados, debes especificar el ID del dispositivo después de `adb -s DEVICE_ID`

#### 1. Obtener UDID del Dispositivo
```bash
# Ver todos los dispositivos conectados (UDID)
adb devices

# Para múltiples dispositivos con detalles
adb devices -l
```

#### 2. Obtener appPackage y appActivity (Aplicación Instalada)
```bash
# 1. Buscar si la aplicación está instalada, en la lista que figura
adb shell pm list packages

# 2. Obtener la actividad principal (main activity)
adb shell cmd package resolve-activity --brief "nombre_app"

# El resultado muestra: com.wdiodemoapp/.MainActivity
# appPackage = com.wdiodemoapp
# appActivity = .MainActivity
```

#### 3. Obtener appPackage y appActivity (APK sin Instalar)
```bash
# Analizar APK directamente desde la ruta del computador
aapt dump badging ruta/mi_app.apk | grep "package\|launchable-activity"

# Del resultado copiar:
# package: name='com.wdiodemoapp' (appPackage)
# launchable-activity: name='com.wdiodemoapp.MainActivity' (appActivity)
```

## 🍎 iOS

#### 1. Obtener UDID del Dispositivo

**Para Simuladores:**
```bash
# Listar todos los simuladores con UDID
xcrun simctl list devices

# Solo simuladores en ejecución
xcrun simctl list devices | grep Booted
```

**Para Dispositivos Físicos:**
```bash
# Instalar herramientas (si no las tienes)
brew install libimobiledevice

# Obtener UDID del dispositivo físico
idevice_id -l

# Información completa incluyendo UDID
ideviceinfo -k UniqueDeviceID
```

#### 2. Obtener bundleId (Aplicación Instalada)

**Para Simuladores:**
```bash
# Buscar aplicación específica
xcrun simctl listapps booted | grep -i "nombre_app"
# se obtendrá el valor de CFBundleIdentifier

# Información detallada de una app específica
xcrun simctl appinfo booted org.reactjs.native.example.wdiodemoapp
```

**Para Dispositivos Físicos:**
```bash
# Listar aplicaciones instaladas
ideviceinstaller -l

# Buscar aplicación específica
ideviceinstaller -l | grep -i "nombre_app"

# Información detallada en formato XML
ideviceinstaller -l -o xml | grep -A 10 "nombre_app"
```

#### 3. Obtener bundleId (IPA sin Instalar)
```bash
# Extraer información del archivo IPA
unzip -l mi_app.ipa | grep Info.plist

# Extraer y analizar el Info.plist
unzip -j mi_app.ipa "Payload/*/Info.plist"
plutil -p Info.plist | grep CFBundleIdentifier

# El resultado muestra: "CFBundleIdentifier" => "org.reactjs.native.example.wdiodemoapp"
# bundleId = org.reactjs.native.example.wdiodemoapp
```
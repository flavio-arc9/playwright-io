# 🤖 Configuración Android SDK

Esta guía le ayudará a instalar y configurar Android SDK para pruebas automatizadas, organizada por sistema operativo.

---

## 🍎 macOS

### 1. Instalar Java JDK
```bash
# Usar Homebrew (recomendado)
brew install openjdk@11

# Verificar instalación
java -version
javac -version
```

### 2. Instalar Android Studio
- Visitar [developer.android.com/studio](https://developer.android.com/studio)
- Descargar el archivo `.dmg` para macOS
- Abrir el `.dmg` y arrastrar Android Studio a Applications
- Ejecutar Android Studio por primera vez para completar la configuración inicial

### 3. Configurar Variables de Entorno
```bash
# Agregar a ~/.zshrc o ~/.bash_profile
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-11.jdk/Contents/Home
export ANDROID_HOME=$HOME/Library/Android/sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Aplicar cambios
source ~/.zshrc
```

### 4. Instalar Componentes SDK
```bash
# Instalar componentes esenciales
sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"
```

## 🪟 Windows

### 1. Instalar Java JDK
- Descargar JDK 11+ desde [Oracle](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- Ejecutar el instalador y seguir las instrucciones
- Verificar instalación:
```cmd
java -version
javac -version
```

### 2. Instalar Android Studio
- Visitar [developer.android.com/studio](https://developer.android.com/studio)
- Descargar el archivo `.exe` para Windows
- Ejecutar como administrador y seguir el asistente de instalación
- Completar la configuración inicial de Android Studio
- **Las variables de entorno se configuran automáticamente durante la instalación**

### 3. Verificar Variables de Entorno (Opcional)

Las variables se configuran automáticamente, pero puedes verificarlas:

```cmd
# Verificar que las variables estén configuradas
echo %ANDROID_HOME%
echo %JAVA_HOME%
echo %PATH%
```

**Solo configurar manualmente si usas Command Line Tools sin Android Studio:**

Si prefieres usar solo las herramientas de línea de comandos (cmdline-tools):
1. Clic derecho en "Este PC" → Propiedades
2. Configuración avanzada del sistema → Variables de entorno
3. Agregar variables del sistema:
   - `ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk`
   - `ANDROID_SDK_ROOT=%ANDROID_HOME%`
4. Editar `Path` y agregar:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\cmdline-tools\latest\bin`

### 4. Instalar Componentes SDK

Los componentes se pueden instalar a través de Android Studio (recomendado) o por línea de comandos:

**Desde Android Studio (Más fácil):**
- File → Settings → System Settings → Android SDK
- Instalar las API levels necesarias

**Desde línea de comandos (Opcional):**
```cmd
# Solo si prefieres usar cmdline-tools
sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"
```

## 🐧 Linux (Ubuntu/Debian)

### 1. Instalar Java JDK
```bash
# Actualizar repositorios
sudo apt update

# Instalar OpenJDK 11
sudo apt install openjdk-11-jdk

# Verificar instalación
java -version
javac -version
```

### 2. Instalar Android Studio
```bash
# Descargar desde developer.android.com/studio
# Extraer el archivo descargado
sudo unzip android-studio-*.zip -d /opt/

# Crear enlace simbólico para fácil acceso
sudo ln -sf /opt/android-studio/bin/studio.sh /usr/local/bin/android-studio

# Ejecutar Android Studio
android-studio
```

### 3. Configurar Variables de Entorno
```bash
# Agregar a ~/.bashrc o ~/.zshrc
export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Aplicar cambios
source ~/.bashrc
```

### 4. Instalar Componentes SDK
```bash
# Instalar componentes esenciales
sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3"
```

## 📱 Configuración de Android Studio

### SDK Manager

1. **Abrir Android Studio**
2. **Acceder al SDK Manager:**
   - File → Settings (Preferences en macOS)
   - Appearance & Behavior → System Settings → Android SDK

3. **Instalar Componentes Requeridos:**

   **SDK Platforms:**
   - ✅ Android 11.0 (API 30)

   **SDK Tools:**
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Intel x86 Emulator Accelerator (HAXM) - Solo procesadores Intel
   - ✅ Google USB Driver (Solo Windows)

4. **Aplicar cambios** y aceptar las licencias

## 🚀 Siguientes Pasos

Una vez completada la configuración del Android SDK:

- **[📦 Instalar Playwright-IO](getting-started/installation.md)** - Instalar el paquete principal
# Registro de Cambios

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto se adhiere al [Versionado Semántico](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-08-21

### 🚀 Agregado
- **Soporte de Ejecución Paralela**: Soporte completo para ejecución paralela de tests de Playwright con gestión inteligente de puertos
- **API de Driver Global**: Driver de WebDriverIO ahora disponible globalmente sin importaciones explícitas
- **Asignación Inteligente de Puertos**: Asignación automática de puertos para servidor MJPEG, SystemPort y WDALocalPort basado en índice de worker
- **Optimización de Recursos**: Configuración inteligente de puertos solo cuando se detectan múltiples workers
- **Testing Paralelo Multiplataforma**: Soporte para ejecución simultánea de tests Android e iOS
- **Gestión de Sesión Mejorada**: Gestión mejorada del ciclo de vida de sesión con limpieza automática y recuperación de errores
- **Arquitectura Thread-Safe**: Cada worker de Playwright mantiene instancias de driver independientes

### 🔧 Mejorado
- **Configuración de Sesión**: Configuración mejorada de sesión móvil con asignación dinámica de puertos
- **Manejo de Errores**: Mejor recuperación de errores para crashes de instrumentación y fallos de sesión
- **Sistema de Grabación**: Grabación mejorada con aislamiento de directorios específicos por worker
- **Soporte TypeScript**: Agregadas declaraciones de tipos globales para acceso fluido al driver
- **Resolución de Conflictos de Puerto**: Detección y resolución automática de conflictos de puerto en ejecución paralela

### 🐛 Corregido
- **Crashes Android UiAutomator2**: Manejo mejorado de fallos del proceso de instrumentación durante ejecución paralela
- **Conflictos Servidor MJPEG**: Resueltos conflictos de puerto al ejecutar múltiples sesiones Android simultáneamente
- **Condiciones de Carrera en Directorio de Grabación**: Corregidas condiciones de carrera en limpieza de grabación entre workers paralelos
- **Limpieza de Sesión**: Asegurada limpieza adecuada de instancias de driver global entre tests

## [1.0.0] - 2025-08-14

### 🎉 Lanzamiento Inicial
- **Integración con Playwright**: Integración completa con el test runner de Playwright
- **Backend WebDriverIO**: Automatización móvil vía WebDriverIO y Appium
- **Soporte Multiplataforma**: Capacidades nativas de testing Android e iOS
- **Grabación de Pantalla**: Grabación de pantalla integrada con generación de video
- **Soporte TypeScript**: Implementación completa de TypeScript con seguridad de tipos
- **Gestión de Sesión**: Ciclo de vida inteligente de sesión WebDriver
- **Sistema de Fixtures**: Fixtures específicos móviles integrados con Playwright
- **Manejo de Errores**: Gestión completa de errores y debugging

### 📱 Características Móviles
- **Testing de Apps Nativas**: Automatización de aplicaciones nativas Android e iOS
- **Testing de Navegador Móvil**: Automatización de Chrome, Safari y WebView
- **Estrategias de Elementos**: Estrategias de localización de elementos multiplataforma
- **Cambio de Contexto**: Transiciones fluidas entre contextos nativo y web
- **Gestión de Dispositivos**: Soporte para dispositivos reales y simuladores

### 🎥 Grabación y Reportes
- **Grabación de Video**: Generación de video MP4 y WebM desde screenshots
- **Captura de Screenshots**: Screenshots automáticos en fallos y captura manual
- **Control de Calidad**: Configuraciones de calidad y compresión de video
- **Integración de Reportes**: Todos los medios automáticamente adjuntados a reportes de Playwright
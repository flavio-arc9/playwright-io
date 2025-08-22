# 📱 Proyectos

Esta guía te muestra cómo configurar diferentes tipos de proyectos en **playwright-io**: configuración global, por proyectos específicos y ejecución paralela.

---

## 🚀 Configuración Global (use)

Configuración por defecto que se aplica a todos los tests:

```ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
    testDir: './tests',
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 1,
    use: {
        // Configuración por defecto para todos los proyectos
        capabilities: {
            platformName: 'Android',
            "appium:automationName": "UiAutomator2",
            "appium:udid": "TU_DEVICE_ID",
            "appium:appPackage": "com.ejemplo.app",
            "appium:appActivity": ".MainActivity"
        }
    }
});
```

## 📱 Configuración por Proyectos

Para configuraciones específicas por dispositivo o plataforma:

```ts
export default defineConfig<TestOptions>({
    testDir: './tests',
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 1,
    projects: [
        {
            name: 'Android App',
            use: {
                capabilities: {
                    platformName: 'Android',
                    "appium:udid": "DEVICE_ID_1",
                    "appium:appPackage": "com.ejemplo.app",
                    "appium:appActivity": ".MainActivity"
                }
            }
        },
        {
            name: 'iOS App',
            use: {
                capabilities: {
                    platformName: 'iOS',
                    "appium:udid": "DEVICE_ID_2",
                    "appium:bundleId": "com.ejemplo.app"
                }
            }
        }
    ]
});
```

> **💡 Nota:** Se define `workers: 1` para que las pruebas se ejecuten secuencialmente por proyectos, evitando conflictos entre dispositivos.

---

## ⚡ Ejecución Paralela

Para ejecutar tests en paralelo en múltiples dispositivos:

```ts
export default defineConfig<TestOptions>({
    testDir: './tests',
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 3, // Número de workers paralelos
    fullyParallel: true, // Ejecutar en paralelo completo
    
    projects: [
        {
            name: 'Android Device 1',
            use: {
                capabilities: {
                    platformName: 'Android',
                    "appium:udid": "emulator-5554",
                    "appium:appPackage": "com.ejemplo.app",
                    "appium:appActivity": ".MainActivity"
                }
            }
        },
        {
            name: 'Android Device 2',
            use: {
                capabilities: {
                    platformName: 'Android',
                    "appium:udid": "emulator-5556",
                    "appium:appPackage": "com.ejemplo.app",
                    "appium:appActivity": ".MainActivity"
                }
            }
        },
        {
            name: 'iOS Device 1',
            use: {
                capabilities: {
                    platformName: 'iOS',
                    "appium:udid": "SIMULATOR_ID",
                    "appium:bundleId": "com.ejemplo.app"
                }
            }
        }
    ]
});
```

> **⚠️ Importante para ejecución paralela:**
> - `workers` = número máximo de dispositivos ejecutando simultáneamente
> - `fullyParallel: true` permite ejecutar todos los tests en paralelo

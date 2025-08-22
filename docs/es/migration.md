# 🔄 Guía de Migración

Manual rápido para migrar a **playwright-io**.

---

## **Desde playwright-webdriverio**

### Paso 1: Actualizar paquete
```bash
npm uninstall playwright-webdriverio
npm install playwright-io --save-dev
```

### Paso 2: Cambiar importaciones
```typescript
// Antes
import { test } from 'playwright-webdriverio';

// Ahora
import { test } from 'playwright-io';
```

### Paso 3: Configuración (opcional)
Tu configuración actual seguirá funcionando. Para nuevas características:

```typescript
// playwright.config.ts
export default defineConfig<TestOptions>({
	workers: 4,              // ✅ Ejecución paralela
	use: {
		// Tu configuración actual...
		capabilities: { /* ... */ },
		
		// ✅ Nuevas opciones (opcionales)
		recordingScreen: true,
		takeScreenshot: true
	}
});
```

### Paso 4: ¡Listo!
Todo tu código actual funcionará igual. Opcionalmente puedes usar el driver global:

```typescript
// Antes (sigue funcionando)
test('mi test', async ({ driver }) => {
  	await driver.$('#button').click();
});

// Nuevo (opcional)
test('mi test', async () => {
  	await driver.$('#button').click(); // Sin fixture
});
```

## **Problemas comunes**

### Error: "driver is not defined"
Verifica que tengas la configuración básica:

```typescript
// playwright.config.ts
export default defineConfig({
	use: {
		capabilities: {
			platformName: 'Android', // o 'iOS'
			// ... tus capabilities
		}
	}
});
```

### TypeScript
Agrega el tipo global:

```json
// tsconfig.json
{
	"compilerOptions": {
		"types": ["playwright-io", "@playwright/test"]
	}
}
```

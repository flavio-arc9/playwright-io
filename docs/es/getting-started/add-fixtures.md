# 🔧 Extender con Fixtures Personalizados

A medida que tus pruebas móviles crecen, necesitarás [fixtures personalizados](https://playwright.dev/docs/test-fixtures) para reutilizar código y configuraciones. En **playwright-io**, puedes extender los fixtures base usando `mergeTests`.

---

## 🎯 ¿Qué son los Fixtures?

Los fixtures son dependencias reutilizables que se ejecutan antes y después de cada prueba:

- **Datos de prueba** - Configuraciones específicas por test  
- **Page Objects** - Instancias compartidas de tus páginas
- **Setup/Teardown** - Configuración de estado inicial

---

## 🏗️ Configuración Básica

### Opción 1: Fixtures simples (solo playwright-io)

Crea `tests/fixtures.ts`:

```typescript
import { test as base } from "playwright-io";

// Definir fixture personalizado para datos de login
export const test = base.extend<{
  loginData: { email: string; password: string };
}>({
    loginData: async ({}, use) => {
        const data = {
        email: 'test@webdriver.io',
        password: 'Test1234!'
        };
        await use(data);
    }
});
```

### Opción 2: Combinando con otras librerías (mergeTests)

Si usas **playwright-bdd** u otras librerías que extienden Playwright, usa `mergeTests`:

```typescript
import { test as base, createBdd } from 'playwright-bdd';
import { test as mobile } from 'playwright-io';
import { mergeTests } from '@playwright/test';

// Crear fixtures personalizados
const customTest = base.extend<{
  loginData: { email: string; password: string };
}>({
  loginData: async ({}, use) => {
    const data = {
      email: 'test@webdriver.io',
      password: 'Test1234!'
    };
    await use(data);
  }
});

// Combinar todos los tests
export const test = mergeTests(mobile, customTest);

// Para playwright-bdd
export const { Given, When, Then } = createBdd(test);
```

> Usa `mergeTests` cuando combines múltiples librerías que extienden Playwright para evitar conflictos de fixtures.

### Usar fixtures en las pruebas

**Para fixtures simples:**
```typescript
import { test } from './fixtures';
import { LoginPage } from './pageobjects/LoginPage';

test('should login with fixture data', async ({ page, loginData }) => {
    const loginPage = new LoginPage(page);
    
    // Usar datos del fixture en lugar de hardcodear
    await loginPage.login(loginData.email, loginData.password);
    await loginPage.waitForAlert();
    
    const alertMessage = await loginPage.getAlertMessage();
    await expect(alertMessage).toContain('You are logged in!');
    
    await loginPage.closeAlert();
});
```

**Para mergeTests con playwright-bdd:**
```typescript
import { Given, When, Then } from './fixtures';
import { LoginPage } from './pageobjects/LoginPage';

// Steps BDD con acceso a fixtures
Given('I have login credentials', async ({ loginData }) => {
    console.log(`Using email: ${loginData.email}`);
});

When('I login with valid credentials', async ({ page, loginData }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(loginData.email, loginData.password);
});
```


# 📝 Escribe tu Primera Prueba Móvil

Siga los pasos a continuación para crear y ejecutar su primera prueba de automatización móvil con **playwright-io**.

Esta guía utiliza TypeScript, pero también puedes usar JavaScript.

---

## Paso 1: Crear Archivo de Configuración

Crea un archivo `playwright.config.ts` en la raíz de tu proyecto:

```ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
    testDir: './tests',
    timeout: 1 * 60 * 1000,
    reporter: [
        ['html'],
        ['list'],
    ],
    workers: 1,
    projects: []
});
```

## Paso 2: Configurar Capabilities de tu Aplicación

> Para este ejemplo usaremos la **WebDriverIO Demo App** que puedes descargar aquí:
> 📥 **[Descargar APK/IPA](https://github.com/webdriverio/native-demo-app/releases/tag/v1.0.8)**

Crea proyectos según el dispositivo que va a realizar pruebas:

**Para Android:**
```ts
{
    name: 'Android App',
    use: {
        capabilities: {
            platformName: 'Android',
            "appium:automationName": "UiAutomator2",
            "appium:udid": "<REEMPLACE_AQUI>",
            "appium:appPackage": "com.wdiodemoapp",
            "appium:appActivity": ".MainActivity"
        }
    }
}
```

**Para iOS:**
```ts
{
    name: 'iOS App',
    use: {
        capabilities: {
            platformName: 'iOS',
            "appium:automationName": "XCUITest",
            "appium:udid": "<REEMPLACE_AQUI>",
            "appium:bundleId": "org.reactjs.native.example.wdiodemoapp"
        }
    }
}
```

> 💡 **Nota:** Lee la sección de **[Inspección de Dispositivos](es/prerequisites/device.md)** para obtener el UDID, appPackage, appActivity y bundleId.


## Paso 3: Crear Page Object (Recomendado)

Crea la carpeta `tests/pageobjects/` y el archivo `LoginPage.ts`:

```ts
import { Page } from "playwright-io";

export class LoginPage {
    readonly loginContainer;
    readonly signUpContainer;
    readonly emailInput;
    readonly passwordInput;
    readonly repeatPasswordInput;
    readonly loginButton;
    readonly signUpButton;
    readonly loginScreen;
    readonly signUpScreen;
    readonly alertTitle;
    readonly alertMessage;

    constructor(private page: Page) {
        // Selectores usando accessibility IDs
        this.loginContainer = page.locator$('~button-login-container');
        this.signUpContainer = page.locator$('~button-sign-up-container');
        this.emailInput = page.locator$('~input-email');
        this.passwordInput = page.locator$('~input-password');
        this.repeatPasswordInput = page.locator$('~input-repeat-password');
        this.loginButton = page.locator$('~button-LOGIN');
        this.signUpButton = page.locator$('~button-SIGN UP');
        this.loginScreen = page.locator$('~Login-screen');
        this.signUpScreen = page.locator$('~Sign-up-screen');
        
        // Selectores cross-platform para alertas
        this.alertTitle = page.selector({
            android: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
            ios: '-ios predicate string:type == "XCUIElementTypeAlert"'
        });
        this.alertMessage = page.selector({
            android: '*//android.widget.TextView[@resource-id="android:id/message"]',
            ios: '-ios predicate string:type == "XCUIElementTypeAlert"'
        });
    }

    async login(email: string, password: string) {
        await this.loginContainer.click();
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.hideKeyboard();
        await this.loginButton.scrollIntoView();
        await this.loginButton.click();
    }

    async signUp(email: string, password: string, repeatPassword: string) {
        await this.signUpContainer.click();
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.repeatPasswordInput.setValue(repeatPassword);
        await this.hideKeyboard();
        await this.signUpButton.scrollIntoView();
        await this.signUpButton.click();
    }

    async waitForAlert() {
        await this.alertTitle.waitForExist({ timeout: 11000 });
    }

    async getAlertMessage() {
        return await this.alertMessage.getText();
    }

    async closeAlert() {
        const okButton = this.page.selector({
            android: '*//android.widget.Button[@text="OK"]',
            ios: '~OK'
        });
        await okButton.click();
        await this.alertTitle.waitForExist({ timeout: 11000, reverse: true });
    }

    private async hideKeyboard() {
        if (await driver.isKeyboardShown()) {
            await this.loginScreen.click();
        }
    }
}
```

## Paso 4: Crear tu Archivo de Prueba

Crea el archivo `tests/login.spec.ts`:

```ts
import { expect, test } from "playwright-io";
import { LoginPage } from "./pageobjects/LoginPage";

test.describe('Login Tests', { tag: '@login' }, () => {

    test.beforeEach(async ({ page }) => {
        await page.locator$('~Home').waitForDisplayed({ timeout: 20000 });
        await page.locator$('~Login').click();
        await page.locator$('~Login-screen').waitForDisplayed();
    });

    test('should login successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.login('test@webdriver.io', 'Test1234!');
        await loginPage.waitForAlert();
        
        const alertMessage = await loginPage.getAlertMessage();
        await expect(alertMessage).toContain('You are logged in!');
        
        await loginPage.closeAlert();
    });

    test('should sign up successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.signUp('test@webdriver.io', 'Test1234!', 'Test1234!');
        await loginPage.waitForAlert();
        
        const alertMessage = await loginPage.getAlertMessage();
        await expect(alertMessage).toContain('You successfully signed up!');
        
        await loginPage.closeAlert();
    });
});
```

> 💡 **Nota:** Puedes acceder a `driver` globalmente o desde el fixture, pero es buena práctica usar el fixture. Como alternativa, usa `page.io` para acceder a métodos específicos de WebDriver.

## Paso 5: Ejecutar tu Prueba

### **Ejecutar todas las pruebas:**
```bash
npm run test
# o
npx playwright test
```

### **Ejecutar solo las pruebas de login:**
```bash
npx playwright test login.spec.ts
```

### **Ejecutar con tags específicos:**
```bash
npx playwright test --grep "@login"
```

#### **✅ Prueba exitosa:**
```bash
Running 2 tests using 1 worker

  ✓  1 [Android App] › tests/login.spec.ts:12:9 › Login Tests › should login successfully @login (13.2s)
  ✓  2 [Android App] › tests/login.spec.ts:24:9 › Login Tests › should sign up successfully @login (14.3s)

  2 passed (28.5s)
```

### **Ver reporte en HTML:**
```bash
npx playwright show-report
```

HTML report:

![Playwright HTML report](./_media/playwright-report.png ':size=100%')

¡Felicidades! 🎉 Has creado y ejecutado tu primera prueba de automatización móvil con **playwright-io**.
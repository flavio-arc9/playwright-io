# 📝 Write Your First Mobile Test

Follow the steps below to create and run your first mobile automation test with **playwright-io**.

This guide uses TypeScript, but you can also use JavaScript.

---

## Step 1: Create Configuration File

Create a `playwright.config.ts` file in the root of your project:

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

## Step 2: Configure Your Application Capabilities

> For this example we'll use the **WebDriverIO Demo App** which you can download here:
> 📥 **[Download APK/IPA](https://github.com/webdriverio/native-demo-app/releases/tag/v1.0.8)**

Create projects according to the device you'll be testing:

**For Android:**
```ts
{
    name: 'Android App',
    use: {
        capabilities: {
            platformName: 'Android',
            "appium:automationName": "UiAutomator2",
            "appium:udid": "<REPLACE_HERE>",
            "appium:appPackage": "com.wdiodemoapp",
            "appium:appActivity": ".MainActivity"
        }
    }
}
```

**For iOS:**
```ts
{
    name: 'iOS App',
    use: {
        capabilities: {
            platformName: 'iOS',
            "appium:automationName": "XCUITest",
            "appium:udid": "<REPLACE_HERE>",
            "appium:bundleId": "org.reactjs.native.example.wdiodemoapp"
        }
    }
}
```

> 💡 **Note:** Read the **[Device Inspection](prerequisites/device-inspection.md)** section to get the UDID, appPackage, appActivity and bundleId.


## Step 3: Create Page Object (Recommended)

Create the `tests/pageobjects/` folder and the `LoginPage.ts` file:

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
        // Selectors using accessibility IDs
        this.loginContainer = page.locator$('~button-login-container');
        this.signUpContainer = page.locator$('~button-sign-up-container');
        this.emailInput = page.locator$('~input-email');
        this.passwordInput = page.locator$('~input-password');
        this.repeatPasswordInput = page.locator$('~input-repeat-password');
        this.loginButton = page.locator$('~button-LOGIN');
        this.signUpButton = page.locator$('~button-SIGN UP');
        this.loginScreen = page.locator$('~Login-screen');
        this.signUpScreen = page.locator$('~Sign-up-screen');
        
        // Cross-platform selectors for alerts
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

## Step 4: Create Your Test File

Create the `tests/login.spec.ts` file:

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

> 💡 **Note:** You can access `driver` globally or from the fixture, but it's good practice to use the fixture. Alternatively, use `page.io` to access WebDriver-specific methods.

## Step 5: Run Your Test

### **Run all tests:**
```bash
npm run test
# or
npx playwright test
```

### **Run only login tests:**
```bash
npx playwright test login.spec.ts
```

### **Run with specific tags:**
```bash
npx playwright test --grep "@login"
```

#### **✅ Successful test:**
```bash
Running 2 tests using 1 worker

  ✓  1 [Android App] › tests/login.spec.ts:12:9 › Login Tests › should login successfully @login (13.2s)
  ✓  2 [Android App] › tests/login.spec.ts:24:9 › Login Tests › should sign up successfully @login (14.3s)

  2 passed (28.5s)
```

### **View HTML report:**
```bash
npx playwright show-report
```

HTML report:

![Playwright HTML report](./_media/playwright-report.png ':size=100%')

Congratulations! 🎉 You have created and run your first mobile automation test with **playwright-io**.
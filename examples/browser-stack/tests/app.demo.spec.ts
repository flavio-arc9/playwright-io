import { expect, test } from "playwright-io";

test.describe('WebdriverIO and Appium, when interacting with a login form,', { tag: '@login' }, () => {

    test.beforeEach(async ({ page }) => {
        await page.locator$('~Home').waitForDisplayed({ timeout: 20000 });
        await page.locator$('~Login').click();
        await page.locator$('~Login-screen').waitForDisplayed({ reverse: false });
    });

    test('should be able login successfully', async ({ driver, page }) => {
        const loginScreen = page.locator$('~Login-screen');
        const loginContainer = page.locator$('~button-login-container');
        const emailInput = page.locator$('~input-email');
        const passwordInput = page.locator$('~input-password');
        const loginButton = page.locator$('~button-LOGIN');

        await loginContainer.click();
        await emailInput.setValue('test@webdriver.io');
        await passwordInput.setValue('Test1234!');
        if (await driver.isKeyboardShown()) {
            await loginScreen.click();
        }
        await loginButton.scrollIntoView({
            scrollableElement: await loginScreen,
        });
        await loginButton.click();

        const alertTitle = page.selector({
            android: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
            ios: '-ios predicate string:type == \'XCUIElementTypeAlert\''
        });

        const alertMessage = page.selector({
            android: '*//android.widget.TextView[@resource-id="android:id/message"]',
            ios: '-ios predicate string:type == \'XCUIElementTypeAlert\''
        });
        await alertTitle.waitForExist({ timeout: 11000, reverse: false });

        await expect(await alertMessage.getText()).toContain('You are logged in!');

        const okButton = page.selector({
            android: '*//android.widget.Button[@text="OK"]',
            ios: '~OK'
        });
        await okButton.click();
        await alertTitle.waitForExist({ timeout: 11000, reverse: true });
    });
});

import { expect } from '@playwright/test';
import { test } from '../src';

test.use({
    capabilities: {
        platformName: 'Android',
        "appium:automationName": "UiAutomator2",
        "appium:appPackage": "com.wdiodemoapp",
        "appium:appActivity": ".MainActivity"
    },
});

test('WebdriverIO Android', { tag: '@webdriverio-android' }, async ({ page, driver }) => {
    await page.waitForTimeout(30000);
    const btnMenuLogin = page.locator$('~Login');
    const inputEmail = page.locator$('~input-email');
    const inputPassoword = page.locator$('~input-password');
    const btnLogin = page.locator$("~button-LOGIN");
    const alert_title = page.locator$('*//android.widget.TextView[@resource-id="android:id/alertTitle"]');

    await btnMenuLogin.click();
    await inputEmail.setValue('test@webdriver.io')
    await inputPassoword.setValue('Test1234!')

    if (await driver.isKeyboardShown()) {
        await page.locator$('~Login-screen').click();
    }

    await btnLogin.scrollIntoView({
        scrollableElement: await page.locator$('~Login-screen'),
    });

    await btnLogin.click();

    await alert_title.waitForExist({
        timeout: 11000,
        reverse: !true,
    });

    const text = await alert_title.getText();
    console.log("MMMM:", text);
    expect(text).toContain('Success');
})
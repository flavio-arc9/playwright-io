import { expect } from '@playwright/test';
import { test } from '../src';

test.use({
    capabilities: {
        platformName: 'IOS',
        "appium:automationName": "XCUITest",
        "appium:bundleId": "org.reactjs.native.example.wdiodemoapp",
        "appium:udid": "CED003A3-85B7-4780-B42E-EA5BF16DB5BB",
    }
});

test('WebdriverIO IOS', async ({ page, driver }) => {
    const btnMenuLogin = page.locator$('~Login');
    const inputEmail = page.locator$('~input-email');
    const inputPassoword = page.locator$('~input-password');
    const btnLogin = page.locator$("~button-LOGIN");
    const alert_title = page.locator$('-ios predicate string:type == \'XCUIElementTypeAlert\'');

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
    expect(text).toContain('Success');
})
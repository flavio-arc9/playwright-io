import { expect } from '@playwright/test';
import { test } from '../src';

test('WebdriverIO Android & IOS pararel projects', { tag: '@pararel' } , async ({ page, driver }) => {
    //Lanzar los dos proyecto Android e IOS
    const screenLogin = page.locator$('~Login-screen');

    const btnMenuLogin = page.locator$({
        android: '~Login',
        ios: '//XCUIElementTypeButton[@name="Login"]'
    });

    const inputEmail = page.locator$({
        android: '~input-email',
        ios: '//XCUIElementTypeTextField[@name="input-email"]'
    });

    const inputPassoword = page.locator$({
        android: '~input-password',
        ios: '//XCUIElementTypeSecureTextField[@name="input-password"]'
    });

    const btnLogin = page.locator$({
        android: '~button-LOGIN',
        ios: '//XCUIElementTypeOther[@name="button-LOGIN"]'
    });

    const alert_title = page.locator$({
        android: '*//android.widget.TextView[@resource-id="android:id/alertTitle"]',
        ios: '-ios predicate string:type == \'XCUIElementTypeAlert\''
    });

    await btnMenuLogin.click();
    await inputEmail.setValue('test@webdriver.io')
    await inputPassoword.setValue('Test1234!')

    if (await driver.isKeyboardShown()) {
        await screenLogin.click();
    }

    await btnLogin.scrollIntoView({
        scrollableElement: await screenLogin,
    });

    await btnLogin.click();

    await alert_title.waitForExist({
        timeout: 11000,
        reverse: !true,
    });

    const text = await alert_title.getText();
    expect(text).toContain('Success');
})
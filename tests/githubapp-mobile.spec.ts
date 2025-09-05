import { expect } from '@playwright/test';
import { test } from '../src';

test.use({
    capabilities: {
        platformName: 'Android',
        "appium:automationName": "UiAutomator2",
        "appium:appPackage": "com.example.appetize",
        "appium:appActivity": ".MainActivity"
    }
});

test('Github Android', { tag: '@temples1' }, async ({ page, driver }) => {

    await page.locator$('//android.widget.EditText[@resource-id="user_input"]').click();
    await page.locator$('//android.widget.EditText[@resource-id="user_input"]').setValue("flavio-arc9");
    await page.locator$('//android.view.View[@resource-id="search_button"]').click();

    await page.locator$('//android.widget.Button[@content-desc="Show Repositories"]').click();

    let repo_exist = page.locator$('//android.view.View[@index=1]/android.view.View[@resource-id="repo_list"]');
    let repo_text = await repo_exist.isDisplayed();
    // await page.locator$$('//android.widget.EditText').length;
    // await page.locator$$('//android.widget.EditText')[0].clearValue();
    // await page.locator$$('//android.widget.EditText')[0].click();
    // await page.locator$$('//android.widget.EditText')[0].setValue("flavio-arc9");
    // await page.locator$$('//android.widget.EditText')[0].getText();

    expect(repo_text).toBe(true);

    await driver.pause(5000);
})
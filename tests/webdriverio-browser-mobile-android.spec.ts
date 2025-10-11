
import { expect } from '@playwright/test';
import { test } from '../src';

test.use({
    config: {
        baseUrl: 'https://playwright.dev/',
    },
    capabilities: {
        platformName: 'Android',
        "appium:browserName": "Chrome",
        "appium:automationName": "UiAutomator2",
        // "appium:appPackage": "com.android.chrome",
        // "appium:appActivity": "com.google.android.apps.chrome.Main",
        "appium:deviceName": "Emulador 5554",
    }
});

test.beforeEach(async ({ page, driver }) => {
    await driver.url('/')
}); 

test.describe('WebdriverIO Browser Mobile', { tag: '@webdriverio-web-mobile1' }, () => {

    test('Demo Test', async ({ page, driver }) => {
        await page.locator$('button[aria-label="Toggle navigation bar"]').click();
        await page.locator$('//a[@href="/docs/intro" and @class="menu__link"]').click();

        await driver.pause(2000);

        const name = await page.locator$('.navbar__title').getText();
        expect(name).toBe('Playwright');
    })

})
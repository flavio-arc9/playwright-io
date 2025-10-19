
import { expect } from '@playwright/test';
import { test } from '../src';

test.use({
    // headless: false,
    config: {
        baseUrl: 'https://playwright.dev/',
    },
    capabilities: {
        platformName: 'IOS',
        "appium:browserName": "Safari",
        "appium:automationName": "XCUITest",
        "appium:udid": "CED003A3-85B7-4780-B42E-EA5BF16DB5BB"
    }
});

test.beforeEach(async ({ page, driver }) => {
    await driver.url('/')
});

test.describe('WebdriverIO Browser Mobile IOS', { tag: '@webdriverio-web-mobile' }, () => {

    test('Demo Test', async ({ page, driver }) => {
        await page.locator$('button[aria-label="Toggle navigation bar"]').click();
        await page.locator$('//a[@href="/docs/intro" and @class="menu__link"]').click();

        await driver.pause(2000);

        const name = await page.locator$('.navbar__title').getText();
        expect(name).toBe('Playwright');
    })

})
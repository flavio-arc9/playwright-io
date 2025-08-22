
import { test, expect } from '../src';

test.use({
    // headless: false,
    config: {
        baseUrl: 'https://playwright.dev/',
    },
    capabilities: {
        platformName: 'Android',
        "appium:browserName": "Chrome",
        "appium:automationName": "UiAutomator2"
    }
});

test.beforeEach(async ({ page, driver }) => {
    await driver.url('/')
}); 

test.describe('WebdriverIO Browser Mobile', { tag: '@webdriverio-web-mobile' }, () => {

    test('Demo Test', async ({ page, driver }) => {
        await page.locator$('button[aria-label="Toggle navigation bar"]').click();
        await page.locator$('//a[@href="/docs/intro" and @class="menu__link"]').click();

        await driver.pause(2000);

        const name = await page.locator$('.navbar__title').getText();
        expect(name).toBe('Playwright');
    })

})
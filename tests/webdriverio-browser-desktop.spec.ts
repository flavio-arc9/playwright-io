import { test, expect } from '../src';

test.use({
    capabilities: {
        browserName: 'chrome',
        acceptInsecureCerts: true
    }
});

const TODO_ITEMS = [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
] as const;

test.beforeEach(async ({ driver }) => {
    await driver.url('https://playwright.dev/');
});

test.describe('WebdriverIO Browser Desktop', { tag: '@webdriverio-web-desktop' }, () => {

    test('Demo Test', async ({ page, driver }) => {
        await page.locator$('//a[@href="/docs/intro"]').click();
        await driver.pause(2000);

        const name = await page.locator$('.navbar__title').getText();
        // You must provide the required parameters, e.g., { requestId: 'your-request-id' }

        expect(name).toBe('Playwright');
    })

    test('Demo Test - Playwright Site Navigation', async ({ driver }) => {
        await driver.url('https://playwright.dev/');

        // Wait for page to load 
        await driver.pause(1000);

        // Click on docs intro link (desktop version)
        const docsLink = await driver.$('//a[@href="/docs/intro"]');
        await docsLink.waitForDisplayed();
        await docsLink.click();

        await driver.pause(2000);

        // Verify we're on the right page
        const title = await driver.$('.navbar__title');
        const titleText = await title.getText();
        expect(titleText).toBe('Playwright');

        // Try search functionality
        const searchBtn = await driver.$('//button[contains(text(), "Search")]');
        if (await searchBtn.isDisplayed()) {
            await searchBtn.click();

            const searchInput = await driver.$('#docsearch-input');
            await searchInput.waitForDisplayed();
            await searchInput.setValue('Playwright');
            await driver.keys('Enter');
        }
    });

    test('TodoMVC - Clear text input after adding item', async ({ driver }) => {
        await driver.url('https://todomvc.com/examples/react/dist/');

        const newTodoInput = await driver.$('input[placeholder="What needs to be done?"]');

        // Create one todo item
        await newTodoInput.setValue(TODO_ITEMS[0]);
        await driver.keys('Enter');

        // Check that input is empty
        const inputValue = await newTodoInput.getValue();
        expect(inputValue).toBe('');
    });

    test('TodoMVC - Mark items as complete', async ({ driver }) => {
        await driver.url('https://todomvc.com/examples/react/dist/');

        const newTodoInput = await driver.$('input[placeholder="What needs to be done?"]');

        // Create two items
        for (const item of TODO_ITEMS.slice(0, 2)) {
            await newTodoInput.setValue(item);
            await driver.keys('Enter');
        }

        // Get todo items
        const todoItems = await driver.$$('li[data-testid="todo-item"]');

        // Check first item
        const firstCheckbox = await todoItems[0].$('input[type="checkbox"]');
        await firstCheckbox.click();

        // Verify first item has completed class
        const firstItemClass = await todoItems[0].getAttribute('class');
        expect(firstItemClass).toContain('completed');

        // Check second item
        const secondCheckbox = await todoItems[1].$('input[type="checkbox"]');

        // Verify second item doesn't have completed class yet
        const secondItemClassBefore = await todoItems[1].getAttribute('class');
        expect(secondItemClassBefore).not.toContain('completed');

        await secondCheckbox.click();

        // Verify both items are completed
        const firstItemClassAfter = await todoItems[0].getAttribute('class');
        const secondItemClassAfter = await todoItems[1].getAttribute('class');

        expect(firstItemClassAfter).toContain('completed');
        expect(secondItemClassAfter).toContain('completed');
    });

    test('WebdriverIO - Browser actions and assertions', async ({ driver }) => {
        await driver.url('https://the-internet.herokuapp.com/');

        // Navigate to different sections
        const links = await driver.$$('a');
        expect(links.length).toBeGreaterThan(0);

        // Click on "Form Authentication"
        const formAuthLink = await driver.$('//a[contains(text(), "Form Authentication")]');
        await formAuthLink.click();

        // Fill login form
        const usernameInput = await driver.$('#username');
        const passwordInput = await driver.$('#password');
        const loginButton = await driver.$('button[type="submit"]');

        await usernameInput.setValue('tomsmith');
        await passwordInput.setValue('SuperSecretPassword!');
        await loginButton.click();

        // Verify successful login
        const flashMessage = await driver.$('#flash');
        const messageText = await flashMessage.getText();
        expect(messageText).toContain('You logged into a secure area!');

        // Logout
        const logoutButton = await driver.$('//a/i[contains(text(), "Logout")]');
        await logoutButton.click();

        // Verify logout
        const logoutMessage = await driver.$('#flash');
        const logoutText = await logoutMessage.getText();
        expect(logoutText).toContain('You logged out of the secure area!');
    });
})
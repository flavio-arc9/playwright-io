import { devices, expect } from "@playwright/test";
import { test } from "../src";

test.use({ ...devices['Desktop Chrome'] });

const TODO_ITEMS = [
    'buy some cheese',
    'feed the cat',
    'book a doctors appointment'
] as const;

test.describe('Playwright Browser',{tag: '@playwright'}, () => {

    test('Demo Test', async ({ page }) => {
        const element = page.locator('//a[@href="/docs/intro"]');
        console.log('Element found:', element);


        await page.goto('https://playwright.dev/');
        await element.first().click();

        let btn = element.first()
        await btn.waitFor({ state: 'visible' });
        await btn.click();
        await page.waitForTimeout(2000);

        const name = await page.innerText('.navbar__title');
        expect(name).toBe('Playwright');

        let btnsearch = page.getByText('Search');
        await btnsearch.waitFor({ state: 'visible' });
        await btnsearch.click();

        let input = page.locator('#docsearch-input');
        await input.waitFor({ state: 'visible' });
        await input.fill('Playwright');
        await input.press('Enter');

        await page.click('text=Playwright');
    })

    test('should allow me to add todo items', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // create a new todo locator
        const newTodo = page.getByPlaceholder('What needs to be done?');

        // Create 1st todo.
        await newTodo.fill(TODO_ITEMS[0]);
        await newTodo.press('Enter');

        // Make sure the list only has one todo item.
        await expect(page.getByTestId('todo-title')).toHaveText([
            TODO_ITEMS[0]
        ]);

        // Create 2nd todo.
        await newTodo.fill(TODO_ITEMS[1]);
        await newTodo.press('Enter');

        // Make sure the list now has two todo items.
        await expect(page.getByTestId('todo-title')).toHaveText([
            TODO_ITEMS[0],
            TODO_ITEMS[1]
        ]);

    });

    test('should clear text input field when an item is added', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // create a new todo locator
        const newTodo = page.getByPlaceholder('What needs to be done?');

        // Create one todo item.
        await newTodo.fill(TODO_ITEMS[0]);
        await newTodo.press('Enter');

        // Check that input is empty.
        await expect(newTodo).toBeEmpty();
    });

    test('should allow me to mark items as complete', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');

        // create a new todo locator
        const newTodo = page.getByPlaceholder('What needs to be done?');

        // Create two items.
        for (const item of TODO_ITEMS.slice(0, 2)) {
            await newTodo.fill(item);
            await newTodo.press('Enter');
        }

        // Check first item.
        const firstTodo = page.getByTestId('todo-item').nth(0);
        await firstTodo.getByRole('checkbox').check();
        await expect(firstTodo).toHaveClass('completed');

        // Check second item.
        const secondTodo = page.getByTestId('todo-item').nth(1);
        await expect(secondTodo).not.toHaveClass('completed');
        await secondTodo.getByRole('checkbox').check();

        // Assert completed class.
        await expect(firstTodo).toHaveClass('completed');
        await expect(secondTodo).toHaveClass('completed');
    });
    
    test('should display the current number of todo items', async ({ page }) => {
        await page.goto('https://demo.playwright.dev/todomvc');
        
        // create a new todo locator
        const newTodo = page.getByPlaceholder('What needs to be done?');

        // create a todo count locator
        const todoCount = page.getByTestId('todo-count')

        await newTodo.fill(TODO_ITEMS[0]);
        await newTodo.press('Enter');

        await expect(todoCount).toContainText('1');

        await newTodo.fill(TODO_ITEMS[1]);
        await newTodo.press('Enter');
        await expect(todoCount).toContainText('2');

    });
});
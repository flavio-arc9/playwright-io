import { Context } from './types';

export * from 'webdriverio';

export { defineConfig, devices, expect } from '@playwright/test';
export { test, driver } from './fixture';
export type { TestInfo } from './fixture';
export type * from './types';

declare global {
    /**
     * Global WebDriverIO driver instance available throughout the test execution.
     * This is automatically set during test execution and cleared between tests.
     * 
     * @example
     * ```ts
     * // Available without imports in any test file
     * test('My test', async () => {
     *   await driver.url('https://example.com');
     *   await driver.$('#button').click();
     * });
     * ```
     */
    var driver: Context;
}

export {};

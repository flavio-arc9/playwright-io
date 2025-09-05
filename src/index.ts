import { Context } from './types/TestArgs';

export * from './types';
export * from './fixture';
export * from 'webdriverio';

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

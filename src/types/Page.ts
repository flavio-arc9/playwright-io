
import { Page as OriginPage } from '@playwright/test';
import { Context, Locators } from './index';
import { ChainablePromiseArray, ChainablePromiseElement } from '../index';

/**
 * Extended Playwright Page interface that adds limited WebDriverIO element selection capabilities.
 */
export interface Page extends OriginPage {
    /**
     * The `io` property provides access to the WebDriverIO context within the Playwright page.
     * This is a reference to the playwright-io project integration.
     * @returns Context - The WebDriverIO context for the page
     */
    io: Context;

    /**
     * The `locator$` method finds an element using platform-specific locators.
     * 
     * This method enhances `locator$` by accepting either a string or a `Locator`
     * object that can contain different locators for various platforms (android, ios, web, mobile).
     * The appropriate locator is chosen based on the current platform.
     *
     * @param selector  A string locator or `Locator` object with platform-specific locators
     * @return ChainablePromiseElement WebDriverIO element object for the found element
     * 
     * @example
     * ```ts
     * // using string locator
     * const button = page.locator$('.submit-button');
     * await button.click();
     *
     * // using platform-specific Locator object
     * const menuButton = page.locator$({
     *   android: '-android=resourceId("com.example.app:id/menu_button")',
     *   ios: '~Menu',
     *   web: '#menuBtn'
     * });
     * await menuButton.click();
     * ```
     */
    locator$: (selector: Locators) => ChainablePromiseElement;

    /**
     * The `locator$$` method finds multiple elements using platform-specific locators.
     *
     * This method enhances `locator$$` by accepting either a string selector or a `Locator`
     * object that can contain different locators for various platforms (android, ios, web, mobile).
     * The appropriate locator is chosen based on the current platform.
     *
     * @param selector  A string selector or `Locator` object with platform-specific locators
     * @return ChainablePromiseArray Array of WebDriverIO element objects for the found elements
     * 
     * @example
     * ```ts
     * // using string selector
     * const buttons = page.locator$$('.btn');
     * console.log('Number of buttons found:', buttons.length);
     * 
     * // using platform-specific Locator object
     * const listItems = page.locator$$({
     *   android: '-android=className("android.widget.ListView").childSelector(className("android.widget.ListItem"))',
     *   ios: '//XCUIElementTypeTable//XCUIElementTypeCell',
     *   web: '.list-item'
     * });
     * 
     * const itemTexts = await Promise.all(listItems.map(item => item.getText()));
     * console.log(itemTexts);
     * ```
     */
    locator$$: (selector: Locators) => ChainablePromiseArray;
    
    /**
     * The `waitForElement` method waits for an element using platform-specific locators.
     * 
     * This method enhances element waiting by accepting either a string selector or a `Locator` 
     * object that can contain different selectors for various platforms (android, ios, web, mobile).
     * The appropriate selector is chosen based on the current platform.
     * 
     * @param selector  A string selector or `Locator` object with platform-specific selectors
     * @param options  Configuration options for timeout, visibility, and enabled state
     * @return ChainablePromiseElement  WebDriverIO element object for the found element
     * 
     * @example
     * ```ts
     * // using string selector
     * const button = await page.waitForElement('.submit-button', { timeout: 5000, visible: true });
     * await button.click();
     * 
     * // using platform-specific Locator object
     * const menuButton = await page.waitForElement({
     *   android: '-android=resourceId("com.example.app:id/menu_button")',
     *   ios: '~Menu',
     *   web: '#menuBtn'
     * }, { visible: true, enabled: true });
     * await menuButton.click();
     * ```
     */
    waitForElement: (selector: Locators, options?: {
        timeout?: number;
        visible?: boolean;
        enabled?: boolean;
    }) => ChainablePromiseArray;
}
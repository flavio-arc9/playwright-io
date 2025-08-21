
import { Page as OriginPage } from '@playwright/test';
import { Context, Element, Elements, Selector } from '.';

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
     * The `locator$` command is a WebDriverIO method that finds an element in the page using 
     * CSS or XPath selectors.
     * 
     * It returns a WebDriverIO element that can be used to perform actions like click, setText, etc.
     * 
     * @param selector  A CSS or XPath selector to query the element
     * @return Element == ChainablePromiseElement  WebDriverIO element object for the found element
     * 
     * @example
     * ```ts
     * // using CSS selector
     * const button = page.locator$('.btn');
     * await button.click();
     * 
     * // using XPath selector
     * const header = page.locator$('//h1');
     * console.log(await header.getText());
     * ```
     */
    locator$: (selector: string) => Element;
    /**
     * The `locator$$` command is a WebDriverIO method that finds multiple elements in the page using 
     * CSS or XPath selectors.
     * 
     * It returns an array of WebDriverIO elements that can be used to perform actions on each element.
     * 
     * @param selector  A CSS or XPath selector to query the elements
     * @return Elements == ChainablePromiseArray  Array of WebDriverIO element objects for the found elements
     * 
     * @example
     * ```ts
     * // using CSS selector
     * const buttons = page.locator$$('.btn');
     * console.log('Number of buttons found:', buttons.length);
     * 
     * // clicking each button in the collection
     * for (const button of buttons) {
     *   await button.click();
     * }
     * 
     * // using XPath selector
     * const headers = page.locator$$('//h2');
     * const headerTexts = await Promise.all(headers.map(header => header.getText()));
     * console.log(headerTexts);
     * ```
     */
    locator$$: (selector: string) => Elements;
    /**
     * The `selector` method finds an element using platform-specific selectors.
     * 
     * This method enhances `locator$` by accepting either a string selector or a `Selector` 
     * object that can contain different selectors for various platforms (android, ios, web, mobile).
     * The appropriate selector is chosen based on the current platform.
     * 
     * @param selector  A string selector or `Selector` object with platform-specific selectors
     * @return Element == ChainablePromiseElement  WebDriverIO element object for the found element
     * 
     * @example
     * ```ts
     * // using string selector
     * const button = page.selector('.submit-button');
     * await button.click();
     * 
     * // using platform-specific Selector object
     * const menuButton = page.selector({
     *   android: '-android=resourceId("com.example.app:id/menu_button")',
     *   ios: '~Menu',
     *   web: '#menuBtn'
     * });
     * await menuButton.click();
     * ```
     */
    selector: (selector: Selector | string) => Element;
    /**
     * The `selectors` method finds multiple elements using platform-specific selectors.
     * 
     * This method enhances `locator$$` by accepting either a string selector or a `Selector` 
     * object that can contain different selectors for various platforms (android, ios, web, mobile).
     * The appropriate selector is chosen based on the current platform.
     * 
     * @param selector  A string selector or `Selector` object with platform-specific selectors
     * @return Element == ChainablePromiseArray  Array of WebDriverIO element objects for the found elements
     * 
     * @example
     * ```ts
     * // using string selector
     * const buttons = page.selectors('.btn');
     * console.log('Number of buttons found:', buttons.length);
     * 
     * // using platform-specific Selector object
     * const listItems = page.selectors({
     *   android: '-android=className("android.widget.ListView").childSelector(className("android.widget.ListItem"))',
     *   ios: '//XCUIElementTypeTable//XCUIElementTypeCell',
     *   web: '.list-item'
     * });
     * 
     * const itemTexts = await Promise.all(listItems.map(item => item.getText()));
     * console.log(itemTexts);
     * ```
     */
    selectors: (selector: Selector | string) => Elements;
    /**
     * The `element` method finds an element using platform-specific selectors.
     * 
     * This method enhances `locator$` by accepting either a string selector or a `Selector` 
     * object that can contain different selectors for various platforms (android, ios, web, mobile).
     * The appropriate selector is chosen based on the current platform.
     * 
     * @param selector  A string selector or `Selector` object with platform-specific selectors
     * @return Element  WebDriverIO element object for the found element
     * 
     * @example
     * ```ts
     * // using string selector
     * const button = page.element('.submit-button');
     * await button.click();
     * 
     * // using platform-specific Selector object
     * const menuButton = page.element({
     *   android: '-android=resourceId("com.example.app:id/menu_button")',
     *   ios: '~Menu',
     *   web: '#menuBtn'
     * });
     * await menuButton.click();
     * ```
     */
    element: (selector: Selector | string) => Element;
    /**
     * The `elements` method finds multiple elements using platform-specific selectors.
     * 
     * This method enhances `locator$$` by accepting either a string selector or a `Selector` 
     * object that can contain different selectors for various platforms (android, ios, web, mobile).
     * The appropriate selector is chosen based on the current platform.
     * 
     * @param selector  A string selector or `Selector` object with platform-specific selectors
     * @return Elements  Array of WebDriverIO element objects for the found elements
     * 
     * @example
     * ```ts
     * // using string selector
     * const buttons = page.elements('.btn');
     * console.log('Number of buttons found:', buttons.length);
     * 
     * // using platform-specific Selector object
     * const listItems = page.elements({
     *   android: '-android=className("android.widget.ListView").childSelector(className("android.widget.ListItem"))',
     *   ios: '//XCUIElementTypeTable//XCUIElementTypeCell',
     *   web: '.list-item'
     * });
     * 
     * const itemTexts = await Promise.all(listItems.map(item => item.getText()));
     * console.log(itemTexts);
     * ```
     */
    elements: (selector: Selector | string) => Elements;
    /**
     * The `waitForElement` method waits for an element to appear in the DOM using platform-specific selectors.
     * 
     * This method accepts either a string selector or a `Selector` object that can contain different selectors
     * for various platforms (android, ios, web, mobile). It waits until the element is present and optionally checks
     * if it is visible or enabled.
     * 
     * @param locator  A string selector or `Selector` object with platform-specific selectors
     * @param options  Optional parameters to control the wait behavior
     * @return ChainablePromiseArray/Element  Array of WebDriverIO element objects for the found elements
     */
    waitForElement: (locator: string | Selector, options?: {
        timeout?: number;
        visible?: boolean;
        enabled?: boolean;
    }) => Elements;
}
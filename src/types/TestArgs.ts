import { Page, TestOptions } from "."
import { Browser as ExtendBrowser } from "webdriverio";

/**
 * Context represents WebDriverIO's Browser instance, 
 * providing access to all WebDriverIO browser commands.
 * See: https://webdriver.io/docs/api/browser
 */
export type Context = ExtendBrowser 

export interface TestArgs extends TestOptions {
    /**
     * The WebDriverIO browser instance that gives access to WebDriverIO's browser API commands.
     * This represents the main browser context for WebDriverIO interaction.
     * See: https://webdriver.io/docs/api/browser
     */
    driver: Context
    /**
     * Extended Playwright Page interface that adds limited WebDriverIO element selection capabilities.
     * 
     * While the WebDriverIO Browser API offers many functions, only locator$ and locator$$ are exposed
     * in this hybrid interface due to compatibility constraints between Playwright and WebDriverIO.
     * 
     * This allows using Playwright's native methods alongside select WebDriverIO element selection
     * and interaction methods on the same page object.
     */
    page: Page
}
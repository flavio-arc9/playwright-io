import { Page } from "./Page"
import { TestOptions } from "./TestOptions"
import { Browser as ExtendBrowser } from "webdriverio";
import { PlaywrightTestArgs, PlaywrightWorkerArgs, PlaywrightWorkerOptions } from "@playwright/test";
import { Session } from "../session";
import { Services } from "../services";

/**
 * Context represents WebDriverIO's Browser instance, 
 * providing access to all WebDriverIO browser commands.
 * See: https://webdriver.io/docs/api/browser
 */
export type Context = ExtendBrowser 

/**
 * Test arguments for a single test case.
 */
export interface TestArgs extends TestOptions, PlaywrightTestArgs {
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

/**
 * Hidden test arguments used internally by the fixture system.
 * These are not exposed in the public API but are used for configuration merging.
 */
export interface HiddenTestArgs {
    _useDefaultObject: object;
    _useDefaultBoolean: boolean;
    _useDefaultArray: Array<any>;
    _useSession?: Session;
}

/**
 * Worker arguments
 */
export interface WorkerArgs extends PlaywrightWorkerArgs, PlaywrightWorkerOptions {
    workerServices: Services;
}
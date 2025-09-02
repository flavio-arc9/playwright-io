import { IOConfig, IOCapabilities, RecorderOptions, IOServices } from ".";
import { PlaywrightTestOptions } from "@playwright/test";

/**
 * Test configuration options for Playwright-IO framework.
 * Extends Playwright's test functionality with WebDriverIO capabilities.
 */
export interface TestOptions extends PlaywrightTestOptions, IOCapabilities {
    /**
     * WebDriverIO session configuration
     * https://webdriver.io/es/docs/configuration#opciones-de-webdriver
     * https://webdriver.io/es/docs/configuration#webdriverio
     * Ignores TestRunnerOptions & Hooks
     */
    config: Partial<IOConfig>;
    /** List of WebDriverIO services to use during the session 
     * Reescrito para su funcionamiento
    */
    services: IOServices[];
    /** Screen recording configuration - can be boolean (use defaults) or RecorderOptions object */
    recordingScreen: RecorderOptions | boolean;
    /** Enable automatic screenshot capture on test failures */
    takeScreenshot: boolean;
}
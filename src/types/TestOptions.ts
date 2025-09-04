import { IOConfig, IOCapabilities, RecorderOptions, IOServices } from ".";
import { PlaywrightTestOptions } from "@playwright/test";

/**
 * Test configuration options for Playwright-IO framework.
 * Extends Playwright with WebDriverIO capabilities and automation services.
 */
export interface TestOptions extends PlaywrightTestOptions, IOCapabilities {
    /**
     * WebDriverIO configuration settings (timeouts, URLs, connection options).
     * Excludes TestRunnerOptions & Hooks - handled by Playwright.
     * @see https://webdriver.io/docs/configuration
     */
    config: Partial<IOConfig>;
    
    /** WebDriverIO services for automation tasks (logging, screenshots, reporting) */
    services: IOServices[];
    
    /** Screen recording during test execution - boolean or detailed RecorderOptions */
    recordingScreen: RecorderOptions | boolean;
    
    /** Automatic screenshot capture on test failures */
    takeScreenshot: boolean;
}
import { IOConfig, IOCapabilities, RecorderOptions } from ".";

/**
 * Test configuration options for Playwright-IO framework.
 * Extends Playwright's test functionality with WebDriverIO capabilities.
 */
export interface TestOptions {
    /** WebDriverIO session configuration */
    config: Partial<IOConfig>;
    /** Device and browser capabilities */
    capabilities: IOCapabilities;
    /** Screen recording configuration - can be boolean (use defaults) or RecorderOptions object */
    recordingScreen: RecorderOptions | boolean;
    /** Enable automatic screenshot capture on test failures */
    takeScreenshot: boolean;
}
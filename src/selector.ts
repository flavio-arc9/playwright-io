import type { Browser } from "webdriverio";
import { Selector } from "./types";

/**
 * Platform detection utilities for WebDriverIO browser instances.
 */
class PlatformDetector {
    /**
     * Determines if the driver is running on Android platform.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running on Android, false otherwise
     */
    static isAndroid(driver: Browser): boolean {
        return driver.isAndroid;
    }

    /**
     * Determines if the driver is running on iOS platform.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running on iOS, false otherwise
     */
    static isIOS(driver: Browser): boolean {
        return driver.isIOS;
    }

    /**
     * Determines if the driver is running on a mobile platform.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running on a mobile platform, false otherwise
     */
    static isMobile(driver: Browser): boolean {
        return driver.isMobile;
    }

    /**
     * Determines if the driver is running in a web browser context.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running in a web browser context, false otherwise
     */
    static isWebBrowser(driver: Browser): boolean {
        return (
            driver.isChromium || 
            driver.isFirefox || 
            driver.isSeleniumStandalone || 
            driver.isW3C
        );
    }
}

/**
 * Resolves platform-specific selectors based on the current WebDriverIO driver context.
 * 
 * @param driver - WebDriverIO browser instance
 * @param locator - String selector or Selector object with platform-specific options
 * @returns Resolved selector string for the current platform
 * @throws Error if no valid selector is found for the current platform
 */
export function getSelector(driver: Browser, locator: Selector | string): string {
    if (typeof locator === 'string') {
        return locator;
    }

    const resolvedSelector = resolvePlatformSelector(driver, locator);
    
    if (resolvedSelector) {
        return resolvedSelector;
    }

    throw new Error(
        `No valid locator found for the current platform. ` +
        `Available selectors: ${Object.keys(locator).join(', ')}`
    );
}

/**
 * Resolves the appropriate selector based on platform detection.
 * @param driver - WebDriverIO browser instance
 * @param selector - Selector object containing platform-specific selectors
 * @returns The resolved selector string or undefined if not found
 */
function resolvePlatformSelector(driver: Browser, selector: Selector): string | undefined {
    if (PlatformDetector.isAndroid(driver) && selector.android) {
        return selector.android;
    }
    
    if (PlatformDetector.isIOS(driver) && selector.ios) {
        return selector.ios;
    }
    
    if (PlatformDetector.isMobile(driver) && selector.mobile) {
        return selector.mobile;
    }
    
    if (PlatformDetector.isWebBrowser(driver) && selector.web) {
        return selector.web;
    }
    
    return undefined;
}
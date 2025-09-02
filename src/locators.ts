import { Browser, Locators as Locator } from "./index";

/**
 * Platform-aware locator resolver for WebDriverIO.
 * Provides platform detection utilities and locator resolution for cross-platform testing.
 */
class Locators {
    /**
     * Resolves platform-specific locators based on the current WebDriverIO driver context.
     * 
     * @param driver - WebDriverIO browser instance
     * @param locator - String locator or Locator object with platform-specific options
     * @returns Resolved locator string for the current platform
     * @throws Error if no valid locator is found for the current platform
     */
    public get(driver: Browser, locator: Locator): string {
        if (typeof locator === 'string') {
            return locator;
        }

        const resolvedLocator = this.resolvePlatformLocator(driver, locator);
        
        if (resolvedLocator) {
            return resolvedLocator;
        }

        throw new Error(
            `No valid locator found for the current platform. ` +
            `Available locators: ${Object.keys(locator).join(', ')}`
        );
    }

    /**
     * Determines if the driver is running on Android platform.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running on Android, false otherwise
     */
    private isAndroid(driver: Browser): boolean {
        return driver.isAndroid;
    }

    /**
     * Determines if the driver is running on iOS platform.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running on iOS, false otherwise
     */
    private isIOS(driver: Browser): boolean {
        return driver.isIOS;
    }

    /**
     * Determines if the driver is running on a mobile platform.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running on a mobile platform, false otherwise
     */
    private isMobile(driver: Browser): boolean {
        return driver.isMobile;
    }

    /**
     * Determines if the driver is running in a web browser context.
     * @param driver - WebDriverIO browser instance
     * @returns True if the driver is running in a web browser context, false otherwise
     */
    private isWebBrowser(driver: Browser): boolean {
        return (
            driver.isChromium || 
            driver.isFirefox || 
            driver.isSeleniumStandalone || 
            driver.isW3C
        );
    }

    /**
     * Resolves the appropriate locator based on platform detection.
     * @param driver - WebDriverIO browser instance
     * @param locator - Locator object containing platform-specific locators
     * @returns The resolved locator string or undefined if not found
     */
    private resolvePlatformLocator(driver: Browser, locator: NonNullable<Exclude<Locator, string>>): string | undefined {
        if (this.isAndroid(driver) && locator.android) {
            return locator.android;
        }
        
        if (this.isIOS(driver) && locator.ios) {
            return locator.ios;
        }
        
        if (this.isMobile(driver) && locator.mobile) {
            return locator.mobile;
        }
        
        if (this.isWebBrowser(driver) && locator.web) {
            return locator.web;
        }
        
        return undefined;
    }
}
export const locators = new Locators();
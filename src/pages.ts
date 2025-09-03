import { helpers } from "./helpers";
import { NetworkInterceptor } from "./network";
import { locators } from "./locators";
import { Context, Page, Locators, WaitForElementOptions } from ".";

/**
 * Manages browser pages and provides utilities for interacting with them.
 * This includes methods for navigating, interacting with elements, and waiting for conditions.
 */
export class Pages {

    private static readonly DEFAULT_WAIT_OPTIONS = {
        timeout: 5000,
        visible: false,
        enabled: false
    } as const;

    private networkInterceptor: NetworkInterceptor;

    constructor(private driver: Context, private page: Page) {
        this.networkInterceptor = new NetworkInterceptor(driver, page);
    }

    /**
     * Prepares and configures an extended Playwright page with WebDriverIO capabilities.
     */
    async resolve() {
        this.networkInterceptor.startCapturing();

        if (helpers.isTraceEnabled()) {
            await this.setupPageContent();
        }
    }

    /**
     * Rejects the current network interception session.
     */
    async reject() {
        await this.networkInterceptor.stopCapturing();
    }

    /**
     * Sets up the page content with mobile device viewer.
     */
    private async setupPageContent() {
        const deviceViewer = this.devicesViewer();
        await this.page.setContent(deviceViewer);
    }

    /**
     * Creates HTML content for mobile device viewer.
     */
    private devicesViewer(): string {
        const mjpegServerPort = (this.driver.capabilities as any)?.mjpegServerPort;

        return `
            <html style="height: 100%;">
                <head>
                    <meta name="viewport" content="width=device-width, minimum-scale=0.1">
                </head>
                <body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);">
                    <img style="display: block; -webkit-user-select: none; margin: auto; background-color: hsl(0, 0%, 25%); height: 100%;" 
                         src="http://localhost:${mjpegServerPort}/">
                </body>
            </html>
        `;
    }

    /**
     * Creates an extended page with WebDriverIO capabilities and network interception.
     */
    get createExtends() {
        const extendedPage = Object.assign(this.page, { ...this.extensions() });
        return extendedPage;
    }

    /**
     * Creates page extensions that add WebDriverIO element selection capabilities to Playwright pages.
     * @returns Object containing extended page methods
     */
    private extensions = () => ({
        /**
         * The `io` property provides access to the WebDriverIO context within the Playwright page.
         * This is a reference to the playwright-io project integration.
         * @returns Context - The WebDriverIO context for the page
         */
        io: this.driver,
        /**
         * Finds a single element using platform-specific selectors.
         * @param selector - String selector or Locator object with platform-specific options
         */
        locator$: (selector: Locators) => {
            const resolvedLocator = locators.get(this.driver, selector);
            return this.driver.$(resolvedLocator);
        },
        /**
         * Finds multiple elements using platform-specific selectors.
         * @param selector - String selector or Locator object with platform-specific options
         */
        locator$$: (selector: Locators) => {
            const resolvedLocator = locators.get(this.driver, selector);
            return this.driver.$$(resolvedLocator);
        },
        /**
         * Waits for an element to meet specified conditions before returning it.
         * @param selector - String selector or Locator object
         * @param options - Wait conditions and timeout configuration
         */
        waitForElement: async (
            selector: Locators,
            options: WaitForElementOptions = {}
        ) => {
            const resolvedLocator = locators.get(this.driver, selector);

            const element = this.driver.$(resolvedLocator);
            const waitConfig = { ...Pages.DEFAULT_WAIT_OPTIONS, ...options };

            await element.waitForExist({ timeout: waitConfig.timeout });

            if (waitConfig.visible) {
                await element.waitForDisplayed({ timeout: waitConfig.timeout });
            }

            if (waitConfig.enabled) {
                await element.waitForEnabled({ timeout: waitConfig.timeout });
            }

            return element;
        }
    });
}
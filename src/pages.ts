import { NetworkInterceptor } from "./network";
import { getSelector } from "./selector";
import { Context, Page, Selector, WaitForElementOptions } from "./types";

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
        await this.configViewport();
        await this.setupPageContent();
    }
    
    /**
     * Rejects the current network interception session.
     */
    async reject() {
        await this.networkInterceptor.stopCapturing();
    }

    /**
     * Configures the page viewport based on driver capabilities.
     */
    private async configViewport() {
        const capabilities = this.driver.capabilities as any;
        const viewport = capabilities.viewportRect;

        if (!viewport) return;

        const pixelRatio = Math.round(capabilities.pixelRatio) + 1;
        const width = Math.round(viewport.width / pixelRatio);
        const height = Math.round(viewport.height / pixelRatio);

        await this.page.setViewportSize({ width, height });
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
        return `
            <html style="height: 100%;">
                <head>
                    <meta name="viewport" content="width=device-width, minimum-scale=0.1">
                </head>
                <body style="margin: 0px; height: 100%; background-color: rgb(14, 14, 14);">
                    <img style="display: block; -webkit-user-select: none; margin: auto; background-color: hsl(0, 0%, 25%); height: 100%;" 
                         src="http://localhost:9000/">
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
         * Finds a single element using WebDriverIO locator syntax.
         * @param locator - CSS selector, XPath, or WebDriverIO selector string
         */
        locator$: (locator: string) => this.driver.$(locator),

        /**
         * Finds multiple elements using WebDriverIO locator syntax.
         * @param locator - CSS selector, XPath, or WebDriverIO selector string
         */
        locator$$: (locator: string) => this.driver.$$(locator),

        /**
         * Finds a single element using platform-specific selectors.
         * @param locator - String selector or Selector object with platform-specific options
         */
        selector: (locator: string | Selector) => {
            const resolvedSelector = getSelector(this.driver, locator);
            return this.driver.$(resolvedSelector);
        },

        /**
         * Finds multiple elements using platform-specific selectors.
         * @param locator - String selector or Selector object with platform-specific options
         */
        selectors: (locator: string | Selector) => {
            const resolvedSelector = getSelector(this.driver, locator);
            return this.driver.$$(resolvedSelector);
        },

        /**
         * Waits for an element to meet specified conditions before returning it.
         * @param locator - String selector or Selector object
         * @param options - Wait conditions and timeout configuration
         */
        waitForElement: async (
            locator: string | Selector,
            options: WaitForElementOptions = {}
        ) => {
            const resolvedSelector = typeof locator === 'string'
                ? locator
                : getSelector(this.driver, locator);

            const element = this.driver.$(resolvedSelector);
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
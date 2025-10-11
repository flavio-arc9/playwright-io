import { remote } from "webdriverio";
import { Context, IORemote, TestOptions } from "./types";
import { test } from './fixture';
import { Recorder } from "./record";
import { helpers } from "./helpers";
import { command } from "./command";

/**
 * WebDriverIO session manager that handles creation, configuration, and cleanup of browser/mobile sessions.
 * Integrates with Playwright test reporting and recording capabilities.
 */
export class Session {

    private static readonly DEFAULT_APPIUM_PORT = 4723;
    private static readonly DEFAULT_MJPEG_PORT = 9110;
    private static readonly DEFAULT_SYS_PORT = 8210;
    private static readonly DEFAULT_LOG_LEVEL = 'silent';

    private driver: Context | undefined;
    private record: Recorder | undefined;

    constructor(private config: IORemote, private testInfo: TestOptions) {
        if (!this.isBrowser()) {
            this.configMobile();
        }

        this.configCommon();
    }

    /**
     * Validates configuration and creates a session instance if valid.
     * @param config  The WebDriverIO remote configuration with capabilities
     * @param testInfo The test information object
     * @returns A new Session instance or undefined if configuration is invalid
     */
    static isValid(config: IORemote, testInfo: TestOptions): Session | undefined {
        if (!(config.capabilities && Object.keys(config.capabilities).length > 0)) {
            console.log("PlaywrightIO", "› Skipping › No capabilities provided.");
            return undefined;
        }
        return new Session(config, testInfo);
    }
    
    /**
     * Determines if this is a BrowserStack session.
     * @returns True if the session is on BrowserStack, false otherwise.
     */
    private isBrowserStack() {
        const capabilities = this.config.capabilities;
        return !!(capabilities &&
            typeof capabilities === 'object' &&
            'bstack:options' in capabilities);
    }

    /**
     * Determines if this is a browser session (not mobile).
     * @returns True if the session is a browser, false otherwise.
     */
    private isBrowser() {
        const capabilities = this.config.capabilities;
        return (
            !!capabilities &&
            typeof capabilities === 'object' &&
            'browserName' in capabilities &&
            !('appium:browserName' in capabilities)
        );
    }

    /**
     * Determines if this is an Android session.
     * @returns True if the session is Android, false otherwise.
     */
    private isAndroid() {
        const capabilities = this.config.capabilities;
        return !!(capabilities &&
            typeof capabilities === 'object' &&
            'platformName' in capabilities &&
            capabilities.platformName?.toUpperCase() === 'ANDROID');
    }

    /**
     * Determines if this is an iOS session.
     * @returns True if the session is iOS, false otherwise.
     */
    private isIOS(): boolean {
        const capabilities = this.config.capabilities;
        return !!(capabilities &&
            typeof capabilities === 'object' &&
            'platformName' in capabilities &&
            capabilities.platformName?.toUpperCase() === 'IOS');
    }

    /**
     * Configures session for mobile/Appium usage.
     */
    private configMobile() {
        const workerId = test.info().workerIndex;
        const systemPort = Session.DEFAULT_SYS_PORT + workerId;
        const mjpegPort = Session.DEFAULT_MJPEG_PORT + workerId;

        if (!this.isBrowserStack()) {
            this.config.port = this.config.port || Session.DEFAULT_APPIUM_PORT;
            return;
        }

        if (helpers.isTraceEnabled()) {
            this.config.capabilities = {
                ...this.config.capabilities,
                'appium:mjpegServerPort': mjpegPort
            };
        }

        if (this.isAndroid()) {
            this.config.capabilities = {
                ...this.config.capabilities,
                'appium:systemPort': systemPort
            };
            return;
        }

        if (this.isIOS()) {
            this.config.capabilities = {
                ...this.config.capabilities,
                'appium:wdaLocalPort': systemPort
            };
            return;
        }
    }

    /**
     * Applies common configuration settings.
     */
    private configCommon() {
        this.config = {
            ...this.config,
            logLevel: this.config.logLevel || Session.DEFAULT_LOG_LEVEL
        };
    }

    /**
     * Creates and initializes a WebDriverIO session with recording capabilities.
     * @returns A promise that resolves to the WebDriverIO driver instance.
     */
    async createSession() {
        return await test.step("Start PlaywrightIO", async () => {
            helpers.setCapability(this.config.capabilities);

            this.driver = await remote(this.config);
            global.driver = this.driver;

            const recordingConfig = this.testInfo.recordingScreen;
            const isRecordingEnabled = recordingConfig === true || (typeof recordingConfig === 'object' && recordingConfig !== null);

            if (isRecordingEnabled) {
                const recordingOptions = typeof recordingConfig === 'object' ? recordingConfig : {};
                this.record = new Recorder(this.driver, test.info(), recordingOptions);
                await this.record.start();
            }

            helpers.setSession(this.driver.sessionId);
            return command.wrapInstance(this.driver);
        }, { box: true });
    }

    /**
     * Closes the session and handles cleanup tasks.
     */
    async deleteSession() {
        await test.step("Finish PlaywrightIO", async () => {
            if (!this.driver) return;

            const recordingConfig = this.testInfo.recordingScreen;
            const isRecordingEnabled = recordingConfig === true || (typeof recordingConfig === 'object' && recordingConfig !== null);
            const shouldTakeScreenshot = this.testInfo.takeScreenshot === true;

            if (shouldTakeScreenshot && this.record) {
                await this.record.screenshot();
            }

            if (isRecordingEnabled && this.record) {
                await this.record.stop();
            }

            await this.driver.deleteSession();
            global.driver = undefined as any;
        }, { box: true });
    }
}
import { remote } from "webdriverio";
import { Context, IORemote, TestOptions } from "./types";
import { test } from './fixture';
import { Recorder } from "./records";
import { annotation } from "./helpers";
import { command } from "./command";

/**
 * WebDriverIO session manager that handles creation, configuration, and cleanup of browser/mobile sessions.
 * Integrates with Playwright test reporting and recording capabilities.
 */
export class Session {

    private static readonly DEFAULT_APPIUM_HOST = 'http://127.0.0.1:4723';
    private static readonly DEFAULT_MJPEG_PORT = 9000;
    private static readonly DEFAULT_LOG_LEVEL = 'error';

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
     */
    static isValid(config: IORemote, testInfo: TestOptions): Session | undefined {
        if (!(config.capabilities && Object.keys(config.capabilities).length > 0)) {
            console.log("PlaywrightIO", "› Skipping › No capabilities provided.");
            return undefined;
        }
        return new Session(config, testInfo);
    }

    /**
     * Determines if this is a browser session (not mobile).
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
     * Configures session for mobile/Appium usage.
     */
    private configMobile() {
        const defaultUrl = new URL(Session.DEFAULT_APPIUM_HOST);

        this.config = {
            ...this.config,
            protocol: this.config.protocol || defaultUrl.protocol.slice(0, -1),
            hostname: this.config.hostname || defaultUrl.hostname,
            port: this.config.port || parseInt(defaultUrl.port, 10)
        };

        this.config.capabilities = {
            ...this.config.capabilities,
            'appium:mjpegServerPort': Session.DEFAULT_MJPEG_PORT
        };
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
     */
    async createSession() {
        return await test.step("Start PlaywrightIO", async () => {
            this.driver = await remote(this.config);

            const recordingConfig = this.testInfo.recordingScreen;
            const isRecordingEnabled = recordingConfig === true || (typeof recordingConfig === 'object' && recordingConfig !== null);

            if (isRecordingEnabled) {
                const recordingOptions = typeof recordingConfig === 'object' ? recordingConfig : {};
                this.record = new Recorder(this.driver, test.info(), recordingOptions);
                await this.record.start(this.isBrowser());
            }

            annotation.add(this.driver, this.config.capabilities);
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
                await this.record.stop(this.isBrowser());
            }

            await this.driver.deleteSession();
        }, { box: true });
    }
}
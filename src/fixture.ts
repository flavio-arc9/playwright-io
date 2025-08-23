import { test as base, TestType } from '@playwright/test';
import { TestArgs, HiddenTestArgs, WorkerArgs, TestOptions, Context } from './types';
import { Pages, Session } from '.';

/**
 * Global WebDriverIO driver instance available throughout the test execution.
 */
export let driver: Context;

/**
 * Extended Playwright test with WebDriverIO integration.
 * Provides fixtures for config, capabilities, driver, page, and session management.
 */
const _test = base.extend<TestArgs & HiddenTestArgs, WorkerArgs>({
    /**
     * Merges the provided configuration with the project-specific configuration.
     * This allows for dynamic configuration based on the test environment.
     * @returns The merged configuration object.
     */
    config: [
        async ({ _useConfig }, use, testInfo) => {
            const mergeConfig = {
                ...(testInfo.project.use as TestOptions).config,
                ..._useConfig,
            };
            await use(mergeConfig);
        },
        { scope: 'test', auto: true },
    ],
    /**
     * Merges the provided capabilities with the project-specific capabilities.
     * This allows for dynamic capabilities based on the test environment.
     * @returns The merged capabilities object.
     */
    capabilities: [
        async ({ _useCapabilities }, use, testInfo) => {
            const merge = {
                ...(testInfo.project.use as TestOptions).capabilities,
                ..._useCapabilities
            }
            await use(merge);
        },
        { scope: 'test', auto: true }
    ],
    /**
     * Merges the provided screenshot options with the project-specific screenshot options.
     * This allows for dynamic screenshot behavior based on the test environment.
     * @returns The merged screenshot options object.
     */
    takeScreenshot: [
        async ({ _useTakeScreenshot }, use, testInfo) => {
            const takeScreenshot = (testInfo.project.use as TestOptions).takeScreenshot;
            const value = takeScreenshot === undefined ? _useTakeScreenshot : takeScreenshot;
            await use(value);
        },
        { scope: 'test', auto: true }
    ],
    /**
     * Merges the provided recording options with the project-specific recording options.
     * This allows for dynamic recording behavior based on the test environment.
     * @returns The merged recording options object.
     */
    recordingScreen: [
        async ({ _useRecordingScreen }, use, testInfo) => {
            const projectRecordingScreen = (testInfo.project.use as TestOptions).recordingScreen;

            if (projectRecordingScreen === undefined) {
                await use(_useRecordingScreen);
                return;
            }

            if (typeof projectRecordingScreen === 'boolean') {
                if (!projectRecordingScreen) {
                    await use(_useRecordingScreen);
                    return;
                }
                await use(_useRecordingScreen);
                return;
            }

            if (typeof _useRecordingScreen === 'object' && _useRecordingScreen !== null) {
                const mergedOptions = {
                    ...projectRecordingScreen,
                    ..._useRecordingScreen
                };
                await use(mergedOptions);
            } else {
                await use(projectRecordingScreen);
            }
        },
        { scope: 'test', auto: true }
    ],
    /**
     * Creates a WebDriverIO session based on the provided configuration and capabilities.
     * This fixture is used to manage the WebDriverIO session lifecycle.
     * The driver instance is also made available globally.
     * @param _useSession  The session management object containing configuration and capabilities
     * @returns driver The created WebDriverIO driver instance
     */
    driver: [
        async ({ _useSession }, use) => {
            if (!_useSession) {
                await use(undefined as any)
                return;
            }

            driver = await _useSession.createSession();

            await use(driver);

            if (driver) await _useSession.deleteSession();
        },
        { scope: 'test' }
    ],
    /**
     * Creates a new page within the WebDriverIO session.
     * @param driver The WebDriverIO driver instance
     * @returns The created page instance
     */
    page: [
        async ({ page, driver }, use) => {
            if (!driver) {
                await use(page);
                return;
            }

            const pages = new Pages(driver, page);
            await pages.resolve();
            await use(pages.createExtends);
            await pages.reject();
        }, { scope: 'test' }
    ],
    /**
     * Manages the WebDriverIO session lifecycle.
     * This fixture is used to create and delete the session based on the provided configuration and capabilities.
     * @param config  The WebDriverIO configuration object
     * @param capabilities  The WebDriverIO capabilities object
     * @param baseURL  The base URL for the WebDriverIO session
     * @returns Session instance managing the WebDriverIO session
     */
    _useSession: [
        async ({ config, capabilities, baseURL }, use, testInfo) => {
            const mergeConfig = {
                ...config,
                capabilities: capabilities,
                baseUrl: baseURL || config.baseUrl,
            };

            const newTestInfo = testInfo.project.use as TestOptions;

            const session = Session.isValid(mergeConfig, newTestInfo);
            if (!session) {
                await use(undefined);
                return;
            };

            await use(session);
        }, { scope: 'test', title: 'session' }
    ],
    _useConfig: [{}, { option: true }],
    _useCapabilities: [{}, { option: true }],
    _useRecordingScreen: [false, { option: true }],
    _useTakeScreenshot: [false, { option: true }],
})

/**
 * Test fixture for managing WebDriverIO sessions.
 */
export const test = _test as TestType<TestArgs, WorkerArgs>;

/**
 * Test information for a single test case.
 */
export type TestInfo = typeof test;

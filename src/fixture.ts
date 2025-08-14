import { test as base } from '@playwright/test';
import { IOCapabilities, IOConfig, RecorderOptions, TestArgs, TestOptions } from './types';
import { Pages, Session } from '.';

/**
 * Hidden test arguments used internally by the fixture system.
 * These are not exposed in the public API but are used for configuration merging.
 */
interface HiddenTestArgs {
    _useCapabilities: IOCapabilities;
    _useConfig: IOConfig;
    _useSession?: Session;
    _useRecordingScreen: RecorderOptions | boolean;
    _useTakeScreenshot: boolean;
}

/**
 * Extended Playwright test with WebDriverIO integration.
 * Provides fixtures for config, capabilities, driver, page, and session management.
 */
const _test = base.extend<TestArgs & HiddenTestArgs>({
    config: [
        async ({ _useConfig }, use, testInfo) => {
            const mergeConfig = {
                ...(testInfo.project.use as TestOptions).config,
                ..._useConfig,
            };
            await use(mergeConfig);
        },
        { auto: true },
    ],
    capabilities: [
        async ({ _useCapabilities }, use, testInfo) => {
            const merge = {
                ...(testInfo.project.use as TestOptions).capabilities,
                ..._useCapabilities
            }
            await use(merge);
        },
        { auto: true }
    ],
    takeScreenshot: [
        async ({ _useTakeScreenshot }, use, testInfo) => {
            const takeScreenshot = (testInfo.project.use as TestOptions).takeScreenshot;
            const value = takeScreenshot === undefined ? _useTakeScreenshot : takeScreenshot;
            await use(value);
        },
        { auto: true }
    ],
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
        { auto: true }
    ],
    driver: [
        async ({ _useSession }, use) => {
            if (!_useSession) throw new Error('❌ No active session found');

            const driver = await _useSession.createSession();
            await use(driver);
            if (driver) await _useSession.deleteSession();
        },
        { scope: 'test' }
    ],
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
        }, { scope: 'test' }
    ],
    _useConfig: [{}, { option: true }],
    _useCapabilities: [{}, { option: true }],
    _useRecordingScreen: [false, { option: true }],
    _useTakeScreenshot: [false, { option: true }],
})

export const test = _test;
export type TestInfo = typeof test;

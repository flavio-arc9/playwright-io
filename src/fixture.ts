import { test as base, TestType } from '@playwright/test';
import type { TestArgs, HiddenTestArgs, WorkerArgs, TestOptions, Context, WdioConfig } from '.';
import { Pages } from './pages';
import { Session } from './session';
import { Services } from './services';

/**
 * Global WebDriverIO driver instance accessible throughout test execution.
 */
export let driver: Context;

/**
 * Extended Playwright test framework with integrated WebDriverIO support.
 * Provides fixtures for configuration, capabilities, driver management, 
 * page objects, services, and session lifecycle management.
 */
const _test = base.extend<TestArgs & HiddenTestArgs, WorkerArgs>({
    /**
     * Worker-scoped services that manage service lifecycle across test workers.
     * Handles preparation, worker start/end, and completion phases.
     * @returns The worker services instance.
     */
    workerServices: [
        async ({ }, use, testInfo) => {
            const options = testInfo.project.use as TestOptions
            const cid = testInfo.workerIndex;

            const config: WdioConfig = {
                ...options.config,
                capabilities: [options.capabilities],
                services: options.services
            }

            const services = new Services(config);

            await services.initLauncher();
            await services.execLauncher('onPrepare', [config, [options.capabilities]]);
            await services.execLauncher('onWorkerStart', [cid, options.capabilities, [], {}, []]);

            await use(services);

            await services.execLauncher('onWorkerEnd', [cid, 0, [], 0]);
            await services.execLauncher('onComplete', [0, config, [options.capabilities], 0]);
            await services.cleanup();
        },
        { scope: 'worker', title: 'Launcher Services', auto: true }
    ],
    /**
     * Merges project and test-specific service configurations.
     * This allows for dynamic configuration based on the test environment.
     * @returns The merged services array.
     */
    services: [
        async ({ _useDefaultArray }, use, testInfo) => {
            const merge = {
                ...(testInfo.project.use as TestOptions).services,
                ..._useDefaultArray,
            }
            await use(merge);
        },
        { scope: 'test' }
    ],
    /**
     * Merges project and test-specific WebDriverIO configuration settings.
     * This allows for dynamic configuration based on the test environment.
     * @returns The merged configuration object.
     */
    config: [
        async ({ _useDefaultObject }, use, testInfo) => {
            const merge = {
                ...(testInfo.project.use as TestOptions).config,
                ..._useDefaultObject,
            };
            await use(merge);
        },
        { scope: 'test' },
    ],
    /**
     * Merges project and test-specific browser/device capabilities.
     * This allows for dynamic capabilities based on the test environment.
     * @returns The merged capabilities object.
     */
    capabilities: [
        async ({ _useDefaultObject }, use, testInfo) => {
            const merge = {
                ...(testInfo.project.use as TestOptions).capabilities,
                ..._useDefaultObject,
            }
            await use(merge);
        },
        { scope: 'test' }
    ],
    /**
     * Merges the provided screenshot options with the project-specific screenshot options.
     * This allows for dynamic screenshot behavior based on the test environment.
     * @returns The merged screenshot options object.
     */
    takeScreenshot: [
        async ({ _useDefaultBoolean }, use, testInfo) => {
            const takeScreenshot = (testInfo.project.use as TestOptions).takeScreenshot;
            const value = takeScreenshot === undefined ? _useDefaultBoolean : takeScreenshot;
            await use(value);
        },
        { scope: 'test' }
    ],
    /**
     * Merges the provided recording options with the project-specific recording options.
     * This allows for dynamic recording behavior based on the test environment.
     * @returns The merged recording options object.
     */
    recordingScreen: [
        async ({ _useDefaultBoolean }, use, testInfo) => {
            const projectRecordingScreen = (testInfo.project.use as TestOptions).recordingScreen;

            let finalValue: boolean | any = _useDefaultBoolean;
            if (projectRecordingScreen !== undefined && projectRecordingScreen !== null) {
                if (typeof projectRecordingScreen === 'boolean') {
                    finalValue = projectRecordingScreen;
                } else if (typeof projectRecordingScreen === 'object') {
                    finalValue = projectRecordingScreen;
                }
            }

            await use(finalValue);
        },
        { scope: 'test' }
    ],
    /**
     * Creates and manages WebDriverIO session with integrated service hooks.
     * Handles initialization, test execution, cleanup, and global driver access.
     * @returns driver The created WebDriverIO driver instance
     */
    driver: [
        async ({ _useSession, workerServices, config, capabilities }, use, testInfo) => {
            const cid = testInfo.workerIndex;

            if (!_useSession) {
                await use(undefined as any)
                return;
            }

            await workerServices.initWorker();

            await workerServices.execWorker('beforeSession', [config, capabilities, [], cid]);

            driver = await _useSession.createSession();

            await workerServices.execWorker('before', [capabilities, [], driver]);
            const suite = {
                type: 'suite',
                title: testInfo.title,
                file: testInfo.file,
                error: testInfo.error,
                duration: testInfo.duration
            }

            await workerServices.execWorker('beforeSuite', [suite]);
            await workerServices.execWorker('beforeTest', [base, testInfo]);
            await workerServices.execWorker('beforeHook', [base, testInfo, 'beforeTest']);

            await use(driver);

            const testResult = {
                error: undefined,
                result: undefined,
                passed: true,
                duration: testInfo.duration,
                retries: 0,
                exception: '',
                status: ''
            }

            await workerServices.execWorker('afterHook', [base, testInfo, testResult, 'afterTest']);
            await workerServices.execWorker('afterTest', [base, testInfo, testResult]);
            await workerServices.execWorker('afterSuite', [suite]);
            await workerServices.execWorker('after', [0, capabilities, []]);
            
            if (driver) await _useSession.deleteSession();
            driver = undefined as any;

            await workerServices.execWorker('afterSession', [config, capabilities, []]);
        },
        { scope: 'test' }
    ],
    /**
     * Enhanced page object with WebDriverIO integration.
     * Falls back to standard Playwright page when driver unavailable.
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
        },
        { scope: 'test' }
    ],
    /**
     * Internal session management that validates and creates WebDriverIO sessions.
     * @returns Session instance managing the WebDriverIO session
     */
    _useSession: [
        async ({ config, capabilities, baseURL, services }, use, testInfo) => {
            const project = (testInfo.project.use as TestOptions);
            const options = {
                ...config, capabilities,
                baseUrl: baseURL || config.baseUrl,
                services: services
            };

            const session = Session.isValid(options, project);
            if (!session) {
                await use(undefined);
                return;
            }
            await use(session);
        },
        { scope: 'test' }
    ],
    // Internal fixture for providing default array values in test overrides
    _useDefaultArray: [[], { option: true }],
    // Internal fixture for providing default object values in test overrides  
    _useDefaultObject: [{}, { option: true }],
    // Internal fixture for providing default boolean values in test overrides
    _useDefaultBoolean: [false, { option: true }]
})

/**
 * Extended Playwright test with WebDriverIO integration.
 */
export const test = _test as TestType<TestArgs, WorkerArgs>;

/**
 * Type definition for the extended test fixture.
 */
export type TestInfo = typeof test;

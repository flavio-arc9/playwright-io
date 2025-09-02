import { test as base, TestType } from '@playwright/test';
import type { TestArgs, HiddenTestArgs, WorkerArgs, TestOptions, Context, WdioConfig } from '.';
import { Pages } from './pages';
import { Session } from './session';
import { Services } from './services';

/**
 * Global WebDriverIO driver instance available throughout the test execution.
 */
export let driver: Context;

/**
 * Extended Playwright test with WebDriverIO integration.
 * Provides fixtures for config, capabilities, driver, page, and session management.
 */
const _test = base.extend<TestArgs & HiddenTestArgs, WorkerArgs>({
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
            console.info('Run onPrepare hook')
            await services.execLauncher('onPrepare', [config, [options.capabilities]]);

            console.info('Run onWorkerStart hook')
            await services.execLauncher('onWorkerStart', [cid, options.capabilities, [], {}, []]);

            await use(services);

            console.info('Run onWorkerEnd hook')
            await services.execLauncher('onWorkerEnd', [cid, 0, [], 0]);

            console.info('Run onComplete hook')
            await services.execLauncher('onComplete', [0, config, [options.capabilities], 0]);
            await services.cleanup();
        },
        { scope: 'worker', title: 'Launcher Services', auto: true }
    ],
    /**
     * Merges the provided configuration with the project-specific configuration.
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
     * Merges the provided capabilities with the project-specific capabilities.
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
     * Creates a WebDriverIO session based on the provided configuration and capabilities.
     * This fixture is used to manage the WebDriverIO session lifecycle.
     * The driver instance is also made available globally.
     * @param _useSession  The session management object containing configuration and capabilities
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

            console.info('Run beforeSession hook');
            await workerServices.execWorker('beforeSession', [config, capabilities, [], cid]);

            driver = await _useSession.createSession();

            console.info('Run before hook');
            await workerServices.execWorker('before', [capabilities, [], driver]);
            const suite = {
                type: 'suite',
                title: testInfo.title,
                // parent: testInfo.parent,
                // fullTitle: testInfo.fullTitle,
                // pending: testInfo.pending,
                file: testInfo.file,
                error: testInfo.error,
                duration: testInfo.duration
            }

            console.info(`Run beforeSuite hook`);
            await workerServices.execWorker('beforeSuite', [suite]);

            console.info(`Run beforeTest hook`);
            await workerServices.execWorker('beforeTest', [base, testInfo]);

            console.info(`Run beforeHook hook`);
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

            console.info(`Run afterHook hook`);
            await workerServices.execWorker('afterHook', [base, testInfo, testResult, 'afterTest']);

            console.info(`Run afterTest hook`);
            await workerServices.execWorker('afterTest', [base, testInfo, testResult]);

            console.info(`Run afterSuite hook`);
            await workerServices.execWorker('afterSuite', [suite]);

            console.info(`Run afterSession hook`);
            await workerServices.execWorker('after', [0, capabilities, []]);
            if (driver) await _useSession.deleteSession();
            driver = undefined as any;

            console.info(`Run afterSession hook`);
            await workerServices.execWorker('afterSession', [config, capabilities, []]);
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
        },
        { scope: 'test' }
    ],
    /**
     * Manages the WebDriverIO session lifecycle with integrated services.
     * Uses both global services (worker scope) and test-specific services (test scope).
     * @param config The WebDriverIO configuration object from test.use()
     * @param capabilities The WebDriverIO capabilities object
     * @returns Session instance managing the WebDriverIO session with services
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
    _useDefaultArray: [[], { option: true }],
    _useDefaultObject: [{}, { option: true }],
    _useDefaultBoolean: [false, { option: true }]
})

/**
 * Test fixture for managing WebDriverIO sessions.
 */
export const test = _test as TestType<TestArgs, WorkerArgs>;

/**
 * Test information for a single test case.
 */
export type TestInfo = typeof test;

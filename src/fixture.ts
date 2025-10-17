import { test as base, TestType } from '@playwright/test';
import { TestArgs, HiddenTestArgs, WorkerArgs, TestOptions, Context, WdioConfig } from '.';
import { Pages } from './pages';
import { Session } from './session';
import { Services } from './services';
import { Hooks } from './hooks';
import { helpers } from './helpers';
import { Frameworks } from '@wdio/types';

/**
 * Global WebDriverIO driver instance accessible throughout test execution.
 */
export let driver: Context;

const exitCode = 0;

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
    worker: [
        async ({ }, use, testInfo) => {
            const options = testInfo.project.use as TestOptions
            const cid = testInfo.parallelIndex + '-' + testInfo.workerIndex;
            const specs = await helpers.getTestFiles(testInfo.project.testDir);

            const config: WdioConfig = {
                ...options.config,
                capabilities: [options.capabilities],
                services: options.services
            }

            const services = new Services();
            await services.initLauncher(config);
            // await services.reportServiceStatus();

            const hooks = new Hooks(services);
            await hooks.onPrepare(config, config.capabilities);
            await hooks.onWorkerStart(cid, options.capabilities as WebdriverIO.Capabilities, specs, config, []);

            await use(hooks);

            await hooks.onWorkerEnd(cid, exitCode, specs);
            await hooks.onComplete(exitCode, config, config.capabilities, {} as any);
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
                services: _useDefaultArray,
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
        async ({ _useSession, worker, config, capabilities, services }, use, testInfo) => {
            const cid = testInfo.parallelIndex + '-' + testInfo.workerIndex;

            if (!_useSession) {
                await use(undefined as any)
                return;
            }

            const wdioConfig: WdioConfig = {
                ...config,
                capabilities: [capabilities],
                ...services
            }

            await worker.beforeSession(wdioConfig, capabilities, [], cid);

            driver = await _useSession.createSession();

            await worker.before(capabilities, [], driver);

            // Configurar información del test para hooks
            (globalThis as any).testInfo = testInfo;

            // Create proper Mocha-compatible suite and test objects
            const suite = MochaHelpers.createSuite(testInfo);
            const testFull = MochaHelpers.createTest(testInfo);

            await worker.beforeSuite(suite);

            await worker.beforeTest(testFull, driver);
            await worker.beforeHook(testFull, driver, 'beforeTest');

            await use(driver);

            // Create proper Mocha-compatible objects for cleanup
            const suite2 = MochaHelpers.createSuite(testInfo);
            const testFull2 = MochaHelpers.createTest(testInfo);
            const testResult = MochaHelpers.createTestResult(testInfo);

            await worker.afterHook(testFull2, driver, testResult, 'afterTest');
            await worker.afterTest(testFull2, driver, testResult);
            await worker.afterSuite(suite2);

            await worker.after(0, capabilities, []);
            if (driver) await _useSession.deleteSession();
            driver = undefined as any;

            await worker.afterSession(config, capabilities as WebdriverIO.Capabilities, []);
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

/**
 * Helper functions to create properly formatted Mocha objects for BrowserStack service
 */
export const MochaHelpers = {
    /**
     * Creates a Mocha-compatible Suite object from Playwright TestInfo
     * @param testInfo - Playwright test info
     * @returns Properly formatted Frameworks.Suite object
     */
    createSuite(testInfo: any): Frameworks.Suite {
        const suiteTitle = testInfo.parent?.title || 
                          testInfo.project?.name || 
                          testInfo.file?.split('/').pop()?.replace('.spec.ts', '') || 
                          'Default Suite';
                          
        return {
            type: 'suite',
            title: suiteTitle,
            parent: testInfo.parent?.title || '',
            fullTitle: suiteTitle,
            pending: false,
            file: testInfo.file || '',
            error: testInfo.error,
            duration: testInfo.duration || 0
        };
    },

    /**
     * Creates a Mocha-compatible Test object from Playwright TestInfo
     * @param testInfo - Playwright test info
     * @returns Properly formatted Frameworks.Test object
     */
    createTest(testInfo: any): Frameworks.Test {
        const suite = MochaHelpers.createSuite(testInfo);
        const testTitle = testInfo.title || 'Untitled Test';
        
        // BrowserStack expects different formats for different frameworks
        // For Mocha: fullTitle = "suite - test" (used in session names)  
        // For Jasmine: fullName = "suite spec description" (parsed to extract suite name)
        const fullTitle = `${suite.title} - ${testTitle}`;
        const fullName = `${suite.title} ${testTitle} ${testTitle}`;  // Jasmine format: suite + space + spec + space + description
        
        return {
            type: 'test',
            title: testTitle,
            parent: suite.title,
            fullTitle: fullTitle,
            fullName: fullName,
            pending: false,
            file: testInfo.file || '',
            error: testInfo.error,
            duration: testInfo.duration || 0,
            ctx: testInfo,
            description: testTitle,
            fn: undefined,
            body: '',
            async: 0,
            sync: true,
            timedOut: false,
            _retriedTest: undefined,
            _currentRetry: testInfo.retry || 0,
            _retries: testInfo.project?.retries || 0
        };
    },

    /**
     * Creates a Mocha-compatible TestResult object from Playwright TestInfo
     * @param testInfo - Playwright test info
     * @returns Properly formatted Frameworks.TestResult object
     */
    createTestResult(testInfo: any): Frameworks.TestResult {
        return {
            error: testInfo.error || undefined,
            result: testInfo.status === 'passed' ? testInfo : undefined,
            passed: testInfo.status === 'passed',
            duration: testInfo.duration || 0,
            retries: { 
                attempts: testInfo.retry || 0, 
                limit: testInfo.project?.retries || 0 
            },
            exception: testInfo.error?.message || '',
            status: testInfo.status?.toString().toUpperCase() || 'UNKNOWN'
        };
    }
};

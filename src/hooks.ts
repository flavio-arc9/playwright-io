import { Services } from "./services";
import { WdioConfig } from "./types";
import { Capabilities, Frameworks, Options } from "@wdio/types";

export class Hooks {

    constructor(private services: Services) { }

    /**
     * Formats test data to match Mocha framework expectations for BrowserStack service
     * @param test - Original test object
     * @returns Formatted test object with Mocha-specific properties
     */
    private formatTestForMocha(test: any): Frameworks.Test {
        if (!test) return test;

        // Extraer información del test de Playwright
        const testInfo = test.info || test;
        const testTitle = testInfo.title || test.title || test.name || test.displayName || 'Unknown Test';
        const parentTitle = testInfo.parent?.title || test.parent?.title || test.parent?.name;
        
        // Crear fullName más robusto
        let fullName = testTitle;
        if (parentTitle && parentTitle !== testTitle) {
            fullName = `${parentTitle} ${testTitle}`.trim();
        }

        // Create a Mocha-compatible test object
        const mochaTest: Frameworks.Test = {
            title: testTitle,
            fullName: fullName,
            description: test.description || testTitle,
            parent: parentTitle ? {
                title: parentTitle,
                ...test.parent
            } : undefined,
            state: test.state || (test.pending ? 'pending' : 'unknown'),
            pending: test.pending || false,
            duration: test.duration || 0,
            file: testInfo.file || test.file || test.location?.file || '',
            body: test.body || test.fn?.toString() || '',
            // Agregar más propiedades que BrowserStack puede necesitar
            ctx: test.ctx || {},
            ...test // Preserve original properties
        };

        return mochaTest;
    }

    /**
     * Formats test result data to match Mocha framework expectations for BrowserStack service
     * @param result - Original test result object
     * @returns Formatted test result object with Mocha-specific properties
     */
    private formatTestResultForMocha(result: any): Frameworks.TestResult {
        if (!result) return result;

        // Create a Mocha-compatible test result object
        const mochaResult: Frameworks.TestResult = {
            passed: result.passed !== undefined ? result.passed : result.status === 'passed',
            duration: result.duration || 0,
            error: result.error || result.err || undefined,
            result: result.result || result.value || undefined,
            retries: result.retries || { attempts: 0, limit: 0 },
            ...result // Preserve original properties
        };

        // Ensure error is properly formatted if it exists
        if (mochaResult.error && typeof mochaResult.error === 'object') {
            mochaResult.error = {
                name: mochaResult.error.name || 'Error',
                message: mochaResult.error.message || 'Unknown error',
                stack: mochaResult.error.stack || '',
                ...mochaResult.error
            };
        }

        return mochaResult;
    }

    /**
     * Formats suite data to match Mocha framework expectations for BrowserStack service
     * @param suite - Original suite object
     * @returns Formatted suite object with Mocha-specific properties
     */
    private formatSuiteForMocha(suite: any): Frameworks.Suite {
        if (!suite) return suite;

        // Create a Mocha-compatible suite object
        const mochaSuite: Frameworks.Suite = {
            title: suite.title || suite.name || suite.description || 'Unknown Suite',
            fullName: suite.fullName || suite.fullTitle || suite.title || suite.name || '',
            parent: suite.parent ? {
                title: suite.parent.title || suite.parent.name || '',
                ...suite.parent
            } : undefined,
            pending: suite.pending || false,
            file: suite.file || suite.location?.file || '',
            duration: suite.duration || 0,
            ...suite // Preserve original properties
        };

        return mochaSuite;
    }

    /**
 * Gets executed once before all workers get launched.
 * @param config        wdio configuration object
 * @param capabilities  list of capabilities details
 */
    async onPrepare(
        config: Options.Testrunner,
        capabilities: Capabilities.TestrunnerCapabilities
    ) {
        return await this.services.execLauncher('onPrepare', [config, [capabilities]]);
    }

    /**
 * Gets executed before a worker process is spawned and can be used to initialize specific service
 * for that worker as well as modify runtime environments in an async fashion.
 * @param cid           capability id (e.g 0-0)
 * @param capabilities  object containing capabilities for session that will be spawn in the worker
 * @param specs         specs to be run in the worker process
 * @param args          object that will be merged with the main configuration once worker is initialized
 * @param execArgv      list of string arguments passed to the worker process
 */
    async onWorkerStart(
        cid: string,
        capabilities: WebdriverIO.Capabilities,
        specs: string[],
        args: Options.Testrunner,
        execArgv: string[]
    ) {
        return await this.services.execLauncher('onWorkerStart', [cid, capabilities, specs, args, execArgv]);
    }

    /**
 * Gets executed just after a worker process has exited.
 * @param  {string} cid      capability id (e.g 0-0)
 * @param  {number} exitCode 0 - success, 1 - fail
 * @param  {object} specs    specs to be run in the worker process
 * @param  {number} retries  number of retries used
 */
    async onWorkerEnd(
        cid: string,
        exitCode: number,
        specs: string[],
        retries: number = 0,
    ) {
        return await this.services.execLauncher('onWorkerEnd', [cid, exitCode, specs, retries]);
    }

    /**
 * Gets executed after all workers got shut down and the process is about to exit. An error
 * thrown in the onComplete hook will result in the test run failing.
 * @param exitCode      runner exit code: 0 - success, 1 - fail
 * @param config        wdio configuration object
 * @param capabilities  list of capabilities details
 * @param results       test results
 */
    async onComplete(
        exitCode: number,
        config: Omit<WdioConfig, 'capabilities'>,
        capabilities: Capabilities.RequestedStandaloneCapabilities[],
        results: Frameworks.Results
    ) {
        return await this.services.execLauncher('onComplete', [exitCode, config, capabilities, results]);
    }

    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param config        wdio configuration object
     * @param capabilities  list of capabilities details
     * @param specs         list of spec file paths that are to be run
     * @param cid           worker id (e.g. 0-0)
     */
    async beforeSession(
        config: Omit<Options.Testrunner, 'capabilities'>,
        capabilities: Capabilities.RequestedStandaloneCapabilities | Capabilities.RequestedMultiremoteCapabilities,
        specs: string[],
        cid: string
    ) {
        return await this.services.execWorker('beforeSession', [config, capabilities, specs, cid]);
    }

    /**
 * Gets executed before test execution begins. At this point you can access to all global
 * variables like `browser`. It is the perfect place to define custom commands.
 * @param capabilities  list of capabilities details
 * @param specs         specs to be run in the worker process
 * @param browser       instance of created browser/device session
 */
    async before(
        capabilities: Capabilities.RequestedStandaloneCapabilities | Capabilities.RequestedMultiremoteCapabilities,
        specs: string[],
        browser: any // BrowserObject
    ) {
        return await this.services.execWorker('before', [capabilities, specs, browser]);
    }

    /**
     * Hook that gets executed before the suite starts.
     * @param suite suite details
     */
    async beforeSuite(suite: Frameworks.Suite) {
        // Format suite data for Mocha framework compatibility with BrowserStack service
        const formattedSuite = this.formatSuiteForMocha(suite);
        return await this.services.execWorker('beforeSuite', [formattedSuite]);
    }    /**
     * Function to be executed before a test (in Mocha/Jasmine only)
     * @param {object} test    test object
     * @param {object} context scope object the test was executed with
     */
    async beforeTest(test: Frameworks.Test, context: any) {
        // Obtener información adicional del contexto de Playwright
        const testInfo = (globalThis as any).testInfo || (test as any).info;
        
        // Crear un objeto test más completo
        const enrichedTest = {
            ...test,
            info: testInfo,
            // Agregar información del archivo y suite
            file: testInfo?.file || test.file,
            title: testInfo?.title || test.title,
            parent: {
                title: testInfo?.parent?.title || context?.suite?.title || 'Default Suite',
                ...(typeof test.parent === 'object' ? test.parent : {})
            }
        };
        
        // Format test data for Mocha framework compatibility with BrowserStack service
        const formattedTest = this.formatTestForMocha(enrichedTest);
        
        console.log('Before Test - Formatted test data:', {
            title: formattedTest.title,
            fullName: formattedTest.fullName,
            parent: formattedTest.parent
        });
        
        return await this.services.execWorker('beforeTest', [formattedTest, context]);
    }

    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha). `stepData` and `world` are Cucumber framework specific properties.
     * @param test      details to current running test (represents step in Cucumber)
     * @param context   context to current running test (represents World object in Cucumber)
     * @param hookName  name of the hook
    */
    async beforeHook(test: any, context: any, hookName: string) {
        // Format test data for Mocha framework compatibility with BrowserStack service
        const formattedTest = this.formatTestForMocha(test);
        return await this.services.execWorker('beforeHook', [formattedTest, context, hookName]);
    }

    /**
     * Hook that gets executed _after_ a hook within the suite ends (e.g. runs after calling
     * afterEach in Mocha). `stepData` and `world` are Cucumber framework specific.
     * @param test      details to current running test (represents step in Cucumber)
     * @param context   context to current running test (represents World object in Cucumber)
     * @param result    test result
     * @param hookName  name of the hook
    */
    async afterHook(test: Frameworks.Test, context: any, result: Frameworks.TestResult, hookName: string) {
        // Format test data for Mocha framework compatibility with BrowserStack service
        const formattedTest = this.formatTestForMocha(test);
        const formattedResult = this.formatTestResultForMocha(result);
        return await this.services.execWorker('afterHook', [formattedTest, context, formattedResult, hookName]);
    }

    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
     * @param {*}       result.result    return object of test function
     * @param {number}  result.duration  duration of test
     * @param {boolean} result.passed    true if test has passed, otherwise false
     * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
     */
    async afterTest(test: Frameworks.Test, context: any, result: Frameworks.TestResult) {
        // Format test data for Mocha framework compatibility with BrowserStack service
        const formattedTest = this.formatTestForMocha(test);
        const formattedResult = this.formatTestResultForMocha(result);
        return await this.services.execWorker('afterTest', [formattedTest, context, formattedResult]);
    }

    /**
     * Hook that gets executed after the suite has ended
     * @param suite suite details
     */
    async afterSuite(suite: Frameworks.Suite) {
        // Format suite data for Mocha framework compatibility with BrowserStack service
        const formattedSuite = this.formatSuiteForMocha(suite);
        return await this.services.execWorker('afterSuite', [formattedSuite]);
    }


    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param result        number of total failing tests
     * @param capabilities  list of capabilities details
     * @param specs         list of spec file paths that are to be run
     */
    async after(
        result: number,
        capabilities: Capabilities.RequestedStandaloneCapabilities | Capabilities.RequestedMultiremoteCapabilities,
        specs: string[]
    ) {
        return await this.services.execWorker('after', [result, capabilities, specs]);
    }


    /**
     * Gets executed right after terminating the webdriver session.
     * @param config        wdio configuration object
     * @param capabilities  list of capabilities details
     * @param specs         list of spec file paths that are to be run
     */
    afterSession(
        config: Options.Testrunner,
        capabilities: WebdriverIO.Capabilities,
        specs: string[]
    ) {
        return this.services.execWorker('afterSession', [config, capabilities, specs]);
    }


}
import { Services } from "./services";
import { WdioConfig } from "./types";
import { Capabilities, Frameworks, Options } from "@wdio/types";

export class Hooks {

    constructor(private services: Services) { }

    /**
     * Gets executed once before all workers get launched.
     * @param config        wdio configuration object
     * @param capabilities  list of capabilities details
     */
    async onPrepare(
        config: Options.Testrunner,
        capabilities: Capabilities.TestrunnerCapabilities
    ) {
        return await this.services.execWorker('onPrepare', [config, [capabilities]]);
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
        return await this.services.execWorker('onWorkerStart', [cid, capabilities, specs, args, execArgv]);
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
        return await this.services.execWorker('onWorkerEnd', [cid, exitCode, specs, retries]);
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
        return await this.services.execWorker('onComplete', [exitCode, config, capabilities, results]);
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
        return await this.services.execTest('beforeSession', [config, capabilities, specs, cid]);
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
        return await this.services.execTest('before', [capabilities, specs, browser]);
    }

    /**
     * Hook that gets executed before the suite starts.
     * @param suite suite details
     */
    async beforeSuite(suite: Frameworks.Suite) {
        return await this.services.execTest('beforeSuite', [suite]);
    }

    /**
     * Function to be executed before a test (in Mocha/Jasmine only)
     * @param {object} test    test object
     * @param {object} context scope object the test was executed with
     */
    async beforeTest(test: Frameworks.Test, context: any) {
        return await this.services.execTest('beforeTest', [test, context]);
    }

    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha). `stepData` and `world` are Cucumber framework specific properties.
     * @param test      details to current running test (represents step in Cucumber)
     * @param context   context to current running test (represents World object in Cucumber)
     * @param hookName  name of the hook
    */
    async beforeHook(test: any, context: any, hookName: string) {
        return await this.services.execTest('beforeHook', [test, context, hookName]);
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
        return await this.services.execTest('afterHook', [test, context, result, hookName]);
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
        return await this.services.execTest('afterTest', [test, context, result]);
    }

    /**
     * Hook that gets executed after the suite has ended
     * @param suite suite details
     */
    async afterSuite(suite: Frameworks.Suite) {
        return await this.services.execTest('afterSuite', [suite]);
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
        return await this.services.execTest('after', [result, capabilities, specs]);
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
        return this.services.execTest('afterSession', [config, capabilities, specs]);
    }


}
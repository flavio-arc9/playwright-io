import type { TestInfo, WorkerInfo } from "@playwright/test";
import { IOConfig, IOServices, TestOptions, WdioConfig } from "./types";
import { helpers } from "./helpers";
import { Services } from "./services";
import { Hooks } from "./hooks";
import { Capabilities, Frameworks } from "@wdio/types"
import { Browser } from "webdriverio";


export class Instance {

    private services: Services;
    private hooks: Hooks;

    private workerInfo: WorkerInfo;
    private workerTestOptions: TestOptions;
    private workerId: string;

    private _config!: WdioConfig;
    private _specs!: string[];
    private workerResult: Frameworks.Results = {
        finished: 0,
        passed: 0,
        failed: 0
    }

    constructor(workerInfo: WorkerInfo) {
        this.services = new Services();
        this.hooks = new Hooks(this.services);

        this.workerInfo = workerInfo;
        this.workerTestOptions = workerInfo.project.use as TestOptions;
        this.workerId = `${workerInfo.parallelIndex}-${workerInfo.workerIndex}`;
    }

    async workerStart() {
        this._specs = await helpers.getTestFiles(this.workerInfo.project.testDir);
        this._config = {
            ...this.workerTestOptions.config,
            capabilities: [this.workerTestOptions.capabilities],
            services: this.workerTestOptions.services,
            framework: 'mocha',
            specs: this._specs
        };

        await this.services.initWorker(this._config);
        await this.hooks.onPrepare(this._config, this._config.capabilities);
        await this.hooks.onWorkerStart(this.workerId, this.workerTestOptions.capabilities as any, this._specs, this._config, []);

    }

    async workerEnd() {
        await this.hooks.onWorkerEnd(this.workerId, 0, this._specs);

        await this.hooks.onComplete(0, this._config, this._config.capabilities, this.workerResult);
        await this.services.cleanup();
    }

    async testStart(testConfig: Partial<IOConfig>, testCapabilities: Capabilities.RequestedStandaloneCapabilities, testServices: IOServices[]) {
        this._config = {
            ...this._config,
            ...testConfig,
            capabilities: [testCapabilities],
            services: testServices
        }

        await this.services.initTest(this._config);
        await this.hooks.beforeSession(this._config, testCapabilities, this._specs, this.workerId);
    }

    async testMiddle(testInfo: TestInfo, driver: Browser) {
        const testSuite = helpers.getSuite(testInfo);
        const test = helpers.getTest(testInfo);

        await this.hooks.before(this._config.capabilities[0], this._specs, driver);
        await this.hooks.beforeSuite(testSuite);
        await this.hooks.beforeTest(test, testInfo);
        await this.hooks.beforeHook(test, testInfo, 'beforeTest');
    }

    async testEnd(testInfo: TestInfo) {
        const testSuite = helpers.getSuite(testInfo);
        const test = helpers.getTest(testInfo);
        const testResult = helpers.getResult(testInfo);

        await this.hooks.afterHook(test, testInfo, testResult, 'afterTest');
        await this.hooks.afterTest(test, testInfo, testResult);
        await this.hooks.afterSuite(testSuite);

        const exitCode = testResult.passed ? 0 : 1;
        await this.hooks.after(exitCode, this._config.capabilities[0], this._specs);
        this.testResult(testInfo);
    }

    private testResult(testInfo: TestInfo) {
        this.workerResult.finished++;

        switch (testInfo.status) {
            case 'passed':
                this.workerResult.passed++;
                break;
            case 'failed':
                this.workerResult.failed++;
                break;
            case 'skipped':
                this.workerResult.finished++; 
                break;
            case 'timedOut':
                this.workerResult.failed++;
                break;
            case 'interrupted':
                this.workerResult.failed++;
                break;
        }
    }
}
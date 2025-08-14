import type { Capabilities } from "@wdio/types";

/**
 * Test runner hook names supported by WebDriverIO.
 */
type TestRunnerHooks = 
    | 'onComplete'
    | 'onPrepare'
    | 'onReload'
    | 'onWorkerStart'
    | 'onWorkerEnd'
    | 'before'
    | 'beforeAssertion'
    | 'beforeCommand'
    | 'beforeHook'
    | 'beforeSession'
    | 'beforeSuite'
    | 'beforeTest'
    | 'beforeFeature'
    | 'beforeScenario'
    | 'beforeStep'
    | 'after'
    | 'afterAssertion'
    | 'afterCommand'
    | 'afterHook'
    | 'afterSession'
    | 'afterSuite'
    | 'afterTest'
    | 'afterFeature'
    | 'afterScenario'
    | 'afterStep';

/**
 * Test runner configuration options supported by WebDriverIO.
 */
type TestRunnerOptions =
    | 'specs'
    | 'exclude'
    | 'suites'
    | 'capabilities'
    | 'injectGlobals'
    | 'specFileRetries'
    | 'specFileRetriesDelay'
    | 'specFileRetriesDeferred'
    | 'groupLogsByTestSpec'
    | 'framework'
    | 'mochaOpts'
    | 'jasmineOpts'
    | 'cucumberOpts'
    | 'cucumberFeaturesWithLineNumbers'
    | 'filesToWatch'
    | 'updateSnapshots'
    | 'tsConfigPath'
    | 'watch'
    | 'shard';

export { TestOptions } from './TestOptions';
export { Context, TestArgs } from './TestArgs';
export { Page } from './Page';

/**
 * WebDriverIO configuration type without test runner specific options.
 */
export type IOConfig = Omit<WebdriverIO.Config, TestRunnerOptions | TestRunnerHooks>;

/**
 * WebDriverIO capabilities type for standalone requests.
 */
export type IOCapabilities = Capabilities.RequestedStandaloneCapabilities;

/**
 * Combined WebDriverIO remote configuration with capabilities.
 */
export type IORemote = IOConfig & {
    capabilities: IOCapabilities;
};

/**
 * Platform-specific selector configuration.
 * Allows defining different selectors for different platforms in a single object.
 */
export interface Selector {
    /** Android-specific selector (UiAutomator2, Espresso) */
    android?: string;
    /** iOS-specific selector (XCUITest) */
    ios?: string;
    /** Web browser selector (CSS, XPath) */
    web?: string;
    /** Generic mobile selector (fallback for both Android/iOS) */
    mobile?: string;
}

/**
 * Configuration options for element waiting operations.
 */
export interface WaitForElementOptions {
    /** Maximum time to wait in milliseconds */
    timeout?: number;
    /** Whether element should be visible */
    visible?: boolean;
    /** Whether element should be enabled */
    enabled?: boolean;
}

/**
 * Configuration options for screen recording
 */
export interface RecorderOptions {
    /** Video format type */
    videoType?: 'mp4' | 'mov' | 'webm';
    /** Video quality setting - can be a preset or CRF value */
    quality?: 'low' | 'medium' | 'high' | 'lossless' | string | number;
    /** Maximum recording duration in seconds */
    maxDuration?: number;
} 
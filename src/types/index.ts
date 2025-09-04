import type { Capabilities, Options, Services } from "@wdio/types";
export type { TestOptions } from './TestOptions';
export type { Context, TestArgs, HiddenTestArgs, WorkerArgs } from './TestArgs';
export type { Page } from './Page';

/**
 * WebDriverIO configuration type without test runner specific options.
 */
export type IOConfig = Options.WebdriverIO

/**
 * WebDriverIO capabilities type for standalone requests.
 */
export type IOCapabilities = Capabilities.WithRequestedCapabilities;

/**
 * WebDriverIO services type for standalone requests.
 */
export type IOServices = Services.ServiceEntry

/**
 * Combined WebDriverIO remote configuration with capabilities.
 */
export type IORemote = IOConfig & IOCapabilities

export type WdioConfig = WebdriverIO.Config

/**
 * Platform-specific selector configuration.
 * Allows defining different selectors for different platforms in a single object.
 */
export type Locators = string | {
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
export type WaitForElementOptions = {
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
export type RecorderOptions = {
    /** Video format type */
    videoType?: 'mp4' | 'mov' | 'webm';
    /** Video quality setting - can be a preset or CRF value */
    quality?: 'low' | 'medium' | 'high' | 'lossless' | string | number;
    /** Maximum recording duration in seconds */
    maxDuration?: number;
} 
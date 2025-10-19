import { test } from ".";
import type { TestInfo } from "@playwright/test";
import { glob } from 'glob';
import { join, resolve } from 'path';
import { Capabilities, Frameworks } from "@wdio/types"

/**
 * Test annotation utilities for adding metadata to Playwright test reports.
 * Provides helper methods for enriching test information with WebDriverIO session details.
 */
class Helper {

    /**
     * Adds the session ID as a test annotation.
     * @param driver - The WebDriverIO context/driver instance
     */
    public setSession(sessionId: string): void {
        test.info().annotations.push({
            type: 'Session ID',
            description: this.formatValue(sessionId),
        });
    }

    /**
     * Adds each capability as a separate test annotation.
     * @param capabilities - The capabilities object used for the session
     */
    public setCapability(capabilities: Capabilities.RequestedStandaloneCapabilities): void {
        for (const [key, value] of Object.entries(capabilities)) {
            test.info().annotations.push({
                type: key,
                description: this.formatValue(value),
            });
        }
    }

    /**
     * Formats capability values for display in annotations.
     * @param value - The capability value to format
     */
    private formatValue(value: unknown): string {
        if (typeof value === 'object' && value !== null) {
            try {
                return JSON.stringify(value);
            } catch {
                return String(value);
            }
        }

        return String(value);
    }

    /**
     * Checks if tracing is enabled based on the test configuration.
     * @returns True if tracing is enabled, false otherwise.
     */
    public isTraceEnabled() {
        const useTrace = test.info().project.use.trace || 'off';

        if (typeof useTrace === 'string') {
            return useTrace !== 'off';
        }

        if (typeof useTrace === 'object' && useTrace !== null) {
            return useTrace.mode !== 'off';
        }

        return false;
    }

    /**
     * Obtiene todos los archivos de test desde el testDir
     */
    async getTestFiles(testDir: string) {
        const patterns = [
            '**/*.spec.ts',
            '**/*.spec.js',
            '**/*.test.ts',
            '**/*.test.js'
        ];

        const files: string[] = [];
        for (const pattern of patterns) {
            const found = await glob(join(testDir, pattern));
            files.push(...found);
        }

        return files.map(file => resolve(file));
    }

    /**
     * Creates a Mocha-compatible Suite object from Playwright TestInfo
     * @param testInfo - Playwright test info
     * @returns Properly formatted Frameworks.Suite object
     */
    public getSuite(testInfo: TestInfo): Frameworks.Suite {
        const suiteTitle = testInfo.titlePath?.length > 1 ? testInfo.titlePath[1] :
            testInfo.project?.name || testInfo.file?.split('/').pop()?.replace('.spec.ts', '') ||
            'Default Suite';
        
        const response = {
            type: 'suite',
            title: suiteTitle,
            parent: testInfo.titlePath?.[0] || '',
            fullTitle: suiteTitle,
            pending: false,
            file: testInfo.file || '',
            error: testInfo.error,
            duration: testInfo.duration || 0
        };
        return response;
    }

    /**
     * Creates a Mocha-compatible Test object from Playwright TestInfo
     * @param testInfo - Playwright test info
     * @returns Properly formatted Frameworks.Test object
     */
    public getTest(testInfo: TestInfo): Frameworks.Test {
        const suite = this.getSuite(testInfo);
        const testTitle = testInfo.title || 'Untitled Test';

        // For Mocha: fullTitle = "suite - test" (used in session names)  
        // For Jasmine: fullName = "suite spec description" (parsed to extract suite name)
        const fullTitle = `${suite.title} - ${testTitle}`;
        const fullName = `${suite.title} ${testTitle} ${testTitle}`

        const response =  {
            type: 'test',
            title: testTitle,
            parent: suite.title,
            fullTitle: fullTitle,
            fullName: fullName,
            pending: false,
            file: testInfo.file || '',
            error: testInfo.error,
            duration: testInfo.duration || 0,
            ctx: {},
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
        return response;
    }

    /**
     * Creates a Mocha-compatible TestResult object from Playwright TestInfo
     * @param testInfo - Playwright test info
     * @returns Properly formatted Frameworks.TestResult object
     */
    getResult(testInfo: TestInfo): Frameworks.TestResult {
        return {
            error: testInfo.error || undefined,
            result: {
                finished: testInfo.status === 'passed' ? 1 : 0,
                passed: testInfo.status === 'passed' ? 1 : 0,
                failed: testInfo.status === 'failed' ? 1 : 0,
            },
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
}

/**
 * Global instance of the Helper class for test annotations.
 */
export const helpers = new Helper();
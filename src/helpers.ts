
import { test } from ".";
import { Capabilities } from "@wdio/types"

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
}

/**
 * Global instance of the Helper class for test annotations.
 */
export const helpers = new Helper();

import { test } from "./fixture";
import { Context, IOCapabilities } from "./types";

/**
 * Test annotation utilities for adding metadata to Playwright test reports.
 * Provides helper methods for enriching test information with WebDriverIO session details.
 */
class Helper {
    
    /**
     * Adds WebDriverIO session and capability annotations to the current test.
     * This enhances test reporting with relevant session metadata.
     * 
     * @param driver - The WebDriverIO context/driver instance
     * @param capabilities - The capabilities object used for the session
     */
    public add(driver: Context, capabilities: IOCapabilities): void {
        this.setSession(driver);
        this.setCapability(capabilities);
    }

    /**
     * Adds the session ID as a test annotation.
     */
    private setSession(driver: Context): void {
        const sessionId = driver.sessionId || 'unknown';
        
        test.info().annotations.push({
            type: 'Session ID',
            description: this.formatValue(sessionId),
        });
    }

    /**
     * Adds each capability as a separate test annotation.
     */
    private setCapability(capabilities: IOCapabilities): void {
        for (const [key, value] of Object.entries(capabilities)) {
            test.info().annotations.push({
                type: key,
                description: this.formatValue(value),
            });
        }
    } 

    /**
     * Formats capability values for display in annotations.
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
}

export const annotation = new Helper();
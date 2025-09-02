import { Context, Page } from ".";

/**
 * Represents a captured network result from WebDriverIO.
 */
interface NetworkResult {
    endpoint: string;
    command?: string;
    method: string;
    result?: unknown;
    body?: unknown;
}

/**
 * Network interceptor that captures WebDriverIO network results and provides
 * mock responses and request simulation for Playwright pages.
 */
export class NetworkInterceptor {

    private static readonly DEFAULT_SESSION_ID = 'unknown';
    private static readonly MOCK_DOMAIN = 'https://playwrightio';
    private static readonly HTTP_METHODS_WITHOUT_BODY = ['GET', 'HEAD'] as const;
    
    private sessionId?: string;
    private capturedResults: NetworkResult[] = [];

    constructor(private driver: Context, private page: Page) { }

    /**
     * Starts capturing network results from the WebDriverIO driver.
     */
    public startCapturing() {
        this.sessionId = this.driver.sessionId || NetworkInterceptor.DEFAULT_SESSION_ID;

        this.driver.on('result', async (result) => {
            await this.handleDriverResult(result, this.driver);
        });
    }

    /**
     * Stops capturing and processes all captured results on the page.
     */
    public async stopCapturing() {
        const processingPromises = this.capturedResults.map(async (result) => {
            await this.createMockRoute(result);
            await this.simulateRequest(result);
        });

        await Promise.all(processingPromises);
    }

    /**
     * Handles individual driver results and processes them for capture.
     * @param result The result object emitted by the WebDriverIO driver
     * @param driver The WebDriverIO context/driver instance
     */
    private async handleDriverResult(result: unknown, driver: Context) {
        const currentSessionId = this.sessionId || driver.sessionId || NetworkInterceptor.DEFAULT_SESSION_ID;
        
        if (this.shouldSkipResult(result)) {
            return;
        }

        const processedResult = this.processResult(result, currentSessionId);
        this.capturedResults.push(processedResult);
    }

    /**
     * Determines if a result should be skipped from processing.
     * @param result The result object to check
     * @returns True if the result should be skipped, false otherwise
     */
    private shouldSkipResult(result: unknown) {
        if (!this.isValidResultObject(result)) {
            return true;
        }

        return !result.endpoint || result.command === 'deleteSession';
    }

    /**
     * Type guard to check if result is a valid result object.
     * @param result The result object to check
     * @returns True if the result is valid, false otherwise
     */
    private isValidResultObject(result: unknown): result is NetworkResult {
        return result !== null && 
               typeof result === 'object' && 
               'endpoint' in result!;
    }

    /**
     * Processes a raw result into a standardized NetworkResult format.
     * @param result The raw result object from WebDriverIO
     * @returns A standardized NetworkResult object
     */
    private processResult(result: unknown, sessionId: string): NetworkResult {
        const resultObj = result as NetworkResult;
        const endpoint = resultObj.endpoint.replace(/:sessionId/g, sessionId);
        return {
            ...resultObj,
            endpoint
        };
    }

    /**
     * Creates a mock route for intercepting requests matching the result endpoint.
     * @param networkResult The captured network result to create a mock route for
     */
    private async createMockRoute(networkResult: NetworkResult) {
        const routePattern = this.createRoutePattern(networkResult.endpoint);

        await this.page.route(routePattern, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: this.createMockHeaders(networkResult),
                body: JSON.stringify(networkResult.result || {})
            });
        });
    }

    /**
     * Creates the route pattern for page.route() from an endpoint.
     * @param endpoint The endpoint to create a route pattern
     * @return The route pattern string
     */
    private createRoutePattern(endpoint: string): string {
        return `**/${endpoint.replace(/^\//, '')}`;
    }

    /**
     * Creates mock headers for the response.
     * @param networkResult The network result to create headers for
     * @returns A record of headers for the mock response
     */
    private createMockHeaders(networkResult: NetworkResult): Record<string, string> {
        return {
            'Content-Type': 'application/json',
            'webdriver-command': networkResult.command || 'unknown',
            'webdriver-method': networkResult.method,
            'webdriver-session-id': this.sessionId || NetworkInterceptor.DEFAULT_SESSION_ID
        };
    }

    /**
     * Simulates a request to the mock endpoint.
     * @param networkResult The network result to simulate
     * @returns The simulated response from the mock endpoint
     */
    private async simulateRequest(networkResult: NetworkResult) {
        const requestOptions = this.createRequestOptions(networkResult);
        
        await this.page.evaluate(async ({ networkResult, mockDomain, requestOptions }) => {
            const requestUrl = `${mockDomain}${networkResult.endpoint}`;
            
            const response = await fetch(requestUrl, requestOptions);
            return response.json();
        }, { 
            networkResult, 
            mockDomain: NetworkInterceptor.MOCK_DOMAIN,
            requestOptions
        });
    }

    /**
     * Creates request options for the simulated fetch request.
     * @param networkResult The network result to create request options for
     * @returns The request options for the simulated fetch request
     */
    private createRequestOptions(networkResult: NetworkResult): RequestInit {
        const options: RequestInit = {
            method: networkResult.method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (this.shouldIncludeBody(networkResult)) {
            options.body = JSON.stringify(networkResult.body);
        }

        return options;
    }

    /**
     * Determines if the request should include a body based on HTTP method.
     * @param networkResult The network result to check
     * @returns True if the request should include a body, false otherwise
     */
    private shouldIncludeBody(networkResult: NetworkResult): boolean {
        const isMethodWithoutBody = NetworkInterceptor.HTTP_METHODS_WITHOUT_BODY
            .includes(networkResult.method as any);
        
        return !isMethodWithoutBody && networkResult.body !== undefined;
    }
}
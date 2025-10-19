import { Services as Service } from "@wdio/types";
import { WdioConfig } from './types';

// Dynamic import for @wdio/utils to handle ES module compatibility
let wdioUtils: any;

async function getWdioUtils() {
    if (!wdioUtils) {
        // Use eval to force a true dynamic import at runtime
        const importFn = new Function('specifier', 'return import(specifier)');
        wdioUtils = await importFn('@wdio/utils');
    }
    return wdioUtils;
}

/**
 * Manages WebDriverIO services lifecycle and hook execution.
 * Handles both launcher-level and worker-level services with caching optimization.
 */
export class Services {

    private workerServices: Service.ServiceInstance[] = [];
    private launcherServices: Service.ServiceInstance[] = [];
    private ignoreServices: string[] = [];
    private isInitialized = false;
    private config: WdioConfig = { capabilities: [{ platformName: 'Unknown' }] };

    /** Cache for service hooks to improve performance */
    private static hookCache = new Map<string, Function[]>();

    /** Checks if services are configured 
     * @returns boolean indicating if services are present
    */
    private isServices() {
        return this.config.services && this.config.services.length > 0;
    }

    /** Initializes launcher-level services for worker preparation */
    async initWorker(config: WdioConfig) {
        if (this.isInitialized) { return }

        this.config = config;

        if (this.isServices()) {
            const { initializeLauncherService } = await getWdioUtils();
            const { launcherServices, ignoredWorkerServices } = await initializeLauncherService(
                this.config,
                this.config.capabilities
            );

            this.launcherServices = launcherServices;
            this.ignoreServices = ignoredWorkerServices;
            this.isInitialized = true;
        }
    }

    /** Executes launcher-level service hooks with caching
     * @param hookName - The name of the hook to execute
     * @param args - Arguments to pass to the hook
     * @returns Results from executing the hooks
     */
    async execWorker(hookName: string, args?: unknown[]) {
        const cacheKey = `launcher-${hookName}`;

        if (!Services.hookCache.has(cacheKey)) {
            const hooks = this.launcherServices
                .filter(service => typeof (service as any)[hookName] === 'function')
                .map(service => ((service as any)[hookName] as Function).bind(service));
            Services.hookCache.set(cacheKey, hooks);
        }

        const hooks = Services.hookCache.get(cacheKey) || [];
        if (hooks.length > 0) {
            const { executeHooksWithArgs } = await getWdioUtils();
            return await executeHooksWithArgs(hookName, hooks, args);
        }
        return [];
    }

    /** Initializes worker-level services for test execution */
    async initTest(config: WdioConfig) {
        this.config = { ...this.config, ...config };
        const { initializeWorkerService } = await getWdioUtils();

        this.workerServices = await initializeWorkerService(
            this.config,
            this.config.capabilities[0] as WebdriverIO.Capabilities,
            this.ignoreServices
        );
        this.config = config;
    }

    /** Executes worker-level service hooks with caching
     * @param hookName - The name of the hook to execute
     * @param args - Arguments to pass to the hook
     * @returns Results from executing the hooks
     */
    async execTest(hookName: string, args?: unknown[]) {
        const cacheKey = `worker-${hookName}`;

        if (!Services.hookCache.has(cacheKey)) {
            const hooks = this.workerServices
                .filter(service => typeof (service as any)[hookName] === 'function')
                .map(service => ((service as any)[hookName] as Function).bind(service));
            Services.hookCache.set(cacheKey, hooks);
        }

        const hooks = Services.hookCache.get(cacheKey) || [];
        if (hooks.length > 0) {
            const { executeHooksWithArgs } = await getWdioUtils();

            return await executeHooksWithArgs(hookName, hooks, args);
        }
        return [];
    }

    /** Cleans up services and clears cache */
    async cleanup() {
        if (!this.isInitialized) return;
        this.isInitialized = false;
        this.ignoreServices = [];
        Services.hookCache.clear();
    }

    /** Reports current status of services for debugging */
    async reportServiceStatus() {
        console.log('=== WebDriverIO Services Status ===');
        console.log('Initialized:', this.isInitialized);
        console.log('Config services:', this.config.services);
        console.log('Launcher services count:', this.launcherServices.length);
        console.log('Worker services count:', this.workerServices.length);
        console.log('Ignored services:', this.ignoreServices);

        if (this.launcherServices.length > 0) {
            console.log('Launcher services details:');
            this.launcherServices.forEach((service, index) => {
                console.log(`  [${index}]:`, {
                    constructor: service.constructor?.name,
                    methods: Object.getOwnPropertyNames(Object.getPrototypeOf(service))
                        .filter(name => typeof (service as any)[name] === 'function' && name !== 'constructor')
                });
            });
        }

        if (this.workerServices.length > 0) {
            console.log('Worker services details:');
            this.workerServices.forEach((service, index) => {
                console.log(`  [${index}]:`, {
                    constructor: service.constructor?.name,
                    methods: Object.getOwnPropertyNames(Object.getPrototypeOf(service))
                        .filter(name => typeof (service as any)[name] === 'function' && name !== 'constructor')
                });
            });
        }
        console.log('================================');
    }
}

import { initializeLauncherService, initializeWorkerService, executeHooksWithArgs } from '@wdio/utils';
import { Services as Service } from "@wdio/types";
import { WdioConfig } from './types';

export class Services {

    private workerServices: Service.ServiceInstance[] = [];
    private launcherServices: Service.ServiceInstance[] = [];
    private ignoreServices: string[] = [];
    private isInitialized = false;

    private static hookCache = new Map<string, Function[]>();

    constructor(private config: WdioConfig) { }

    private isServices() {
        return this.config.services && this.config.services.length > 0;
    }

    async initLauncher() {
        if (this.isInitialized) { return }

        if (this.isServices()) {
            const { launcherServices, ignoredWorkerServices } = await initializeLauncherService(
                this.config,
                this.config.capabilities
            );

            this.launcherServices = launcherServices;
            this.ignoreServices = ignoredWorkerServices;
            this.isInitialized = true;
        }
    }

    async execLauncher(hookName: string, args?: unknown[]) {
        const cacheKey = `launcher-${hookName}`;
        
        if (!Services.hookCache.has(cacheKey)) {
            const hooks = this.launcherServices
                .filter(service => typeof (service as any)[hookName] === 'function')
                .map(service => ((service as any)[hookName] as Function).bind(service));
            Services.hookCache.set(cacheKey, hooks);
        }

        const hooks = Services.hookCache.get(cacheKey) || [];
        if (hooks.length > 0) {
            return await executeHooksWithArgs(hookName, hooks, args);
        }
        return [];
    }

    async initWorker() {
        this.workerServices = await initializeWorkerService(
            this.config,
            this.config.capabilities[0] as any,
            this.ignoreServices
        );
    }

    async execWorker(hookName: string, args?: unknown[]) {
        const cacheKey = `worker-${hookName}`;
        
        if (!Services.hookCache.has(cacheKey)) {
            const hooks = this.workerServices
                .filter(service => typeof (service as any)[hookName] === 'function')
                .map(service => ((service as any)[hookName] as Function).bind(service));
            Services.hookCache.set(cacheKey, hooks);
        }

        const hooks = Services.hookCache.get(cacheKey) || [];
        if (hooks.length > 0) {
            return await executeHooksWithArgs(hookName, hooks, args);
        }
        return [];
    }

    async cleanup() {
        if (!this.isInitialized) return;
        this.isInitialized = false;
        this.ignoreServices = [];
        Services.hookCache.clear();
    }
}

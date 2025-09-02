import { initializeLauncherService, initializeWorkerService, executeHooksWithArgs } from '@wdio/utils';
import { Capabilities, Services as Service } from "@wdio/types";
import { WdioConfig } from './types';

export class Services {

    private workerServices: any[] = [];
    private launcherServices: Service.ServiceInstance[] = [];
    private ignoreServices: string[] = [];
    private isInitialized = false;

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
            console.log(`✅ Total de Launchers: ${launcherServices.length}`);
            console.log(`ℹ️ Total de workers: ${ignoredWorkerServices.join(', ')}`);

            this.launcherServices = launcherServices;
            this.ignoreServices = ignoredWorkerServices;
            this.isInitialized = true;
        }
    }

    async execLauncher(hookName: string, args?: unknown[]) {
        const hooks = this.launcherServices
            .filter(service => typeof (service as any)[hookName] === 'function')
            .map(service => ((service as any)[hookName] as Function).bind(service));

        if (hooks.length > 0) {
            console.log(`🎯 Executing ${hooks.length} ${hookName} hooks...`);
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
        console.log(`✅ Total Workers: ${this.workerServices.length} services`);
    }

    async execWorker(hookName: string, args?: unknown[]) {
        const hooks = this.workerServices
            .filter(service => typeof (service as any)[hookName] === 'function')
            .map(service => ((service as any)[hookName] as Function).bind(service));

        if (hooks.length > 0) {
            console.log(`🎯 Executing ${hooks.length} ${hookName} hooks...`);
            return await executeHooksWithArgs(hookName, hooks, args);
        }
        return [];
    }

    async cleanup() {
        if (!this.isInitialized) return;

        console.log('✅ Cleanup completed');
        this.isInitialized = false;
        this.ignoreServices = [];
    }

    getAvailableHooks(): string[] {
        const hookNames = new Set<string>();

        this.workerServices.forEach(service => {
            Object.getOwnPropertyNames(Object.getPrototypeOf(service)).forEach(prop => {
                if (typeof service[prop] === 'function') {
                    hookNames.add(prop);
                }
            });
        });

        return Array.from(hookNames).sort();
    }

    debugServicesAndHooks() {
        console.log('\n🔍 Services Debug Information:');
        console.log('='.repeat(50));

        this.workerServices.forEach((service, index) => {
            const serviceName = service.constructor.name || `Service${index}`;
            const hooks = Object.getOwnPropertyNames(Object.getPrototypeOf(service))
                .filter(prop => typeof service[prop] === 'function');

            console.log(`📦 ${serviceName}:`);
            if (hooks.length > 0) {
                hooks.forEach(hook => console.log(`   🎯 ${hook}`));
            } else {
                console.log('   (no hooks implemented)');
            }
            console.log('');
        });
    }
}

export class BaseCustomService {
    protected options: any;
    protected capabilities: any;
    protected config: any;
    protected serviceName: string;

    constructor(options: any = {}, capabilities: any = {}, config: any = {}) {
        this.options = options
        this.capabilities = capabilities
        this.config = config
        this.serviceName = this.constructor.name
    }

    // Hooks estándar de WebDriverIO que pueden implementar los servicios
    async before(capabilities: any, specs: any): Promise<void> {}
    async beforeSuite(suite: any): Promise<void> {}
    async beforeTest(test: any, context: any): Promise<void> {}
    async beforeHook(test: any, context: any): Promise<void> {}
    async beforeCommand(commandName: any, args: any): Promise<void> {}
    async afterCommand(commandName: any, args: any, result: any, error: any): Promise<void> {}
    async afterHook(test: any, context: any, result: any): Promise<void> {}
    async afterTest(test: any, context: any, result: any): Promise<void> {}
    async afterSuite(suite: any): Promise<void> {}
    async after(result: any, capabilities: any, specs: any): Promise<void> {}
}

import { BaseCustomService } from './base-custom-service';

/**
 * Servicio de ejemplo: Logging detallado
 */
export class LoggingService extends BaseCustomService {
    private logCommands: boolean;

    constructor(options: any = {}) {
        super(options)
        this.logCommands = options.logCommands !== false
    }

    async beforeCommand(commandName: any, args: any): Promise<void> {
        if (this.logCommands) {
            console.log(`🔧 Comando: ${commandName}(${JSON.stringify(args)})`)
        }
    }

    async afterCommand(commandName: any, args: any, result: any, error: any): Promise<void> {
        if (this.logCommands && error) {
            console.error(`❌ Error en comando ${commandName}:`, error.message)
        }
    }

    async beforeTest(test: any): Promise<void> {
        console.log(`📝 LoggingService: Iniciando test ${test.name}`)
    }

    async afterTest(test: any, context: any, { passed, duration }: { passed: boolean, duration: number }): Promise<void> {
        const status = passed ? '✅' : '❌'
        console.log(`📝 LoggingService: ${status} Test ${test.name} completado en ${duration}ms`)
    }
}

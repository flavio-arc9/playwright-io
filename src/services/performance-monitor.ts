/**
 * Servicio de Performance que usa todos los hooks
 */
export class PerformanceMonitorService {
    private options: any;
    private metrics: {
        commands: Array<{
            command: string;
            duration: number;
            success: boolean;
            timestamp: number;
        }>;
        tests: Array<{
            test: string;
            duration: number;
            passed: boolean;
            timestamp: number;
        }>;
        sessionStart: number | null;
    };
    private _commandStart?: number;

    constructor(options: any = {}) {
        this.options = options;
        this.metrics = {
            commands: [],
            tests: [],
            sessionStart: null
        };
    }

    async beforeSession(config: any, capabilities: any, specs: any[]) {
        this.metrics.sessionStart = Date.now();
        console.log(`🚀 PerformanceMonitor: Sesión iniciada con ${capabilities.browserName}`);
    }

    async beforeTest(test: any, context: any) {
        test._startTime = Date.now();
        console.log(`📊 PerformanceMonitor: Test iniciado "${test.title}"`);
    }

    async beforeCommand(commandName: string, args: any[]) {
        this._commandStart = Date.now();
    }

    async afterCommand(commandName: string, args: any[], result: any, error?: Error) {
        if (this._commandStart) {
            const duration = Date.now() - this._commandStart;
            this.metrics.commands.push({
                command: commandName,
                duration,
                success: !error,
                timestamp: Date.now()
            });

            if (duration > 2000) { // Más de 2 segundos
                console.warn(`⚠️ Comando lento: ${commandName} tardó ${duration}ms`);
            }
        }
    }

    async afterTest(test: any, context: any, result: any) {
        if (test._startTime) {
            const duration = Date.now() - test._startTime;
            this.metrics.tests.push({
                test: test.title,
                duration,
                passed: result.passed,
                timestamp: Date.now()
            });
            console.log(`📊 Test "${test.title}" completado en ${duration}ms`);
        }
    }

    async afterSession(config: any, capabilities: any, specs: any[]) {
        if (!this.metrics.sessionStart) return;
        
        const totalDuration = Date.now() - this.metrics.sessionStart;
        console.log(`📊 PerformanceMonitor: Sesión completada en ${totalDuration}ms`);
        this.generateReport();
    }

    generateReport() {
        const avgCommandTime = this.metrics.commands.length > 0
            ? this.metrics.commands.reduce((sum, cmd) => sum + cmd.duration, 0) / this.metrics.commands.length
            : 0;

        const slowestCommands = this.metrics.commands
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 3);

        console.log('\n📊 Performance Report:');
        console.log(`   Comandos ejecutados: ${this.metrics.commands.length}`);
        console.log(`   Tiempo promedio por comando: ${avgCommandTime.toFixed(2)}ms`);
        console.log(`   Tests ejecutados: ${this.metrics.tests.length}`);

        if (slowestCommands.length > 0) {
            console.log('   Comandos más lentos:');
            slowestCommands.forEach((cmd, i) => {
                console.log(`     ${i + 1}. ${cmd.command}: ${cmd.duration}ms`);
            });
        }
    }

    /**
     * Método para obtener métricas programáticamente
     */
    getMetrics() {
        return {
            ...this.metrics,
            avgCommandTime: this.metrics.commands.length > 0
                ? this.metrics.commands.reduce((sum, cmd) => sum + cmd.duration, 0) / this.metrics.commands.length
                : 0,
            slowestCommands: this.metrics.commands
                .sort((a, b) => b.duration - a.duration)
                .slice(0, 5)
        };
    }

    /**
     * Método para resetear métricas
     */
    resetMetrics() {
        this.metrics = {
            commands: [],
            tests: [],
            sessionStart: null
        };
    }
}
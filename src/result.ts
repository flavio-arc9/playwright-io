import { Frameworks } from '@wdio/types';

interface TestResultData {
    workerId: string;
    testInfo: any;
    result: {
        passed: boolean;
        error?: any;
        duration?: number;
        retries?: number;
        status?: string;
    };
    timestamp: number;
}

interface WorkerStats {
    passed: number;
    failed: number;
    skipped: number;
    total: number;
    duration: number;
}

export class TestResultCollector {
    private static instance: TestResultCollector;
    private testResults: Map<string, TestResultData> = new Map();
    private workerResults: Map<string, WorkerStats> = new Map();
    private startTime: number = Date.now();

    static getInstance(): TestResultCollector {
        if (!TestResultCollector.instance) {
            TestResultCollector.instance = new TestResultCollector();
        }
        return TestResultCollector.instance;
    }

    addTestResult(workerId: string, testInfo: any, result: { 
        passed: boolean; 
        error?: any; 
        duration?: number; 
        retries?: number;
        status?: string;
    }) {
        const key = `${workerId}-${testInfo.title}`;
        this.testResults.set(key, {
            workerId,
            testInfo,
            result,
            timestamp: Date.now()
        });

        // Actualizar estadísticas del worker
        const stats = this.workerResults.get(workerId) || { 
            passed: 0, 
            failed: 0, 
            skipped: 0, 
            total: 0, 
            duration: 0 
        };
        
        stats.total++;
        stats.duration += result.duration || 0;
        
        if (result.status === 'skipped') {
            stats.skipped++;
        } else if (result.passed) {
            stats.passed++;
        } else {
            stats.failed++;
        }
        
        this.workerResults.set(workerId, stats);
    }

    getWorkerExitCode(workerId: string): number {
        const stats = this.workerResults.get(workerId);
        return stats && stats.failed > 0 ? 1 : 0;
    }

    getOverallExitCode(): number {
        for (const stats of this.workerResults.values()) {
            if (stats.failed > 0) return 1;
        }
        return 0;
    }

    getWorkerResults(workerId: string): WorkerStats | undefined {
        return this.workerResults.get(workerId);
    }

    /**
     * Convierte los resultados a formato Frameworks.Results de WebDriverIO
     */
    toFrameworkResults(): Frameworks.Results {
        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;
        
        // Calcular estadísticas totales
        const totalStats = Array.from(this.workerResults.values()).reduce(
            (acc, stats) => ({
                passed: acc.passed + stats.passed,
                failed: acc.failed + stats.failed,
                skipped: acc.skipped + stats.skipped,
                total: acc.total + stats.total,
                duration: acc.duration + stats.duration
            }),
            { passed: 0, failed: 0, skipped: 0, total: 0, duration: 0 }
        );

        return {
            finished: totalStats.total,
            passed: totalStats.passed,
            failed: totalStats.failed
        } as Frameworks.Results;
    }

    getAllResults() {
        return {
            tests: Array.from(this.testResults.values()),
            workers: Array.from(this.workerResults.entries()).map(([workerId, stats]) => ({
                workerId,
                ...stats
            })),
            overallExitCode: this.getOverallExitCode(),
            frameworkResults: this.toFrameworkResults(),
            totalDuration: Date.now() - this.startTime
        };
    }

    clear() {
        this.testResults.clear();
        this.workerResults.clear();
        this.startTime = Date.now();
    }

    /**
     * Establece el tiempo de inicio para calcular duración total
     */
    setStartTime(time?: number) {
        this.startTime = time || Date.now();
    }

    /**
     * Obtiene estadísticas resumidas
     */
    getSummary() {
        const allResults = this.getAllResults();
        const frameworkResults = this.toFrameworkResults();
        
        return {
            totalTests: frameworkResults.finished,
            passed: frameworkResults.passed,
            failed: frameworkResults.failed,
            skipped: allResults.workers.reduce((acc, worker) => acc + worker.skipped, 0),
            duration: allResults.totalDuration,
            exitCode: this.getOverallExitCode(),
            workers: allResults.workers.length,
            successRate: frameworkResults.finished > 0 
                ? Math.round((frameworkResults.passed / frameworkResults.finished) * 100) 
                : 0
        };
    }
}

export const collector = TestResultCollector.getInstance();
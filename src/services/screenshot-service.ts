import { BaseCustomService } from './base-custom-service';

/**
 * Servicio de ejemplo: Screenshots automáticos
 */
export class ScreenshotService extends BaseCustomService {
    private screenshotPath: string;
    private screenshotOnFailure: boolean;
    private screenshotIndex: number;

    constructor(options: any = {}) {
        super(options)
        this.screenshotPath = options.screenshotPath || './screenshots'
        this.screenshotOnFailure = options.screenshotOnFailure !== false
        this.screenshotIndex = 0
    }

    async beforeTest(test: any): Promise<void> {
        console.log(`📸 ScreenshotService: Preparando para test ${test.name}`)
    }

    async afterTest(test: any, context: any, { error, passed }: { error: any, passed: boolean }): Promise<void> {
        if (error && this.screenshotOnFailure) {
            await this.takeScreenshot(`failed-${test.name}`)
        }
    }

    async takeScreenshot(name: string): Promise<void> {
        try {
            if ((global as any).browser) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
                const filename = `${this.screenshotPath}/${++this.screenshotIndex}-${name}-${timestamp}.png`
                await (global as any).browser.saveScreenshot(filename)
                console.log(`📸 Screenshot guardado: ${filename}`)
            }
        } catch (error: any) {
            console.warn('⚠️ No se pudo tomar screenshot:', error.message)
        }
    }
}

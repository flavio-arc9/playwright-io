/**
 * Ejemplo de integración de servicios con Playwright usando Session.ts extendido
 * 
 * Este ejemplo muestra cómo los servicios WebDriverIO se integran automáticamente
 * con los fixtures de Playwright a través de Session.ts que ahora soporta servicios.
 */

import { test } from '../src/fixture';
import { expect } from '@playwright/test';
// import { SimpleViewportLoggerService } from '../src/services/simple-viewport-logger';

test.use({
    capabilities: {
        browserName: 'chrome',
    },
    // services: [
    //     [SimpleViewportLoggerService as any, {
    //         enabled: true,
    //         styles: {
    //             wrapper: { backgroundColor: 'rgba(255,255,255,0.95)' },
    //             text: { color: 'black', fontSize: '18px' },
    //             closeButton: { color: 'red' },
    //         },
    //     }],
    // ]
})

test.describe('Services Integration', { tag: '@services' }, () => {
    test('GLOBAL SERVICES', async ({ driver, page }) => {
        try {

            // 4. Usar el driver normalmente con el viewport logger
            await driver.url('https://www.google.com');

            // El servicio SimpleViewportLoggerService agregó automáticamente los comandos
            // const browserWithLogger = driver as any;

            // Probar el viewport logger (ya no necesitamos verificar si existe)
            // await browserWithLogger.logToViewport('🚀 Navegando a Google...', {
            //     text: { color: 'blue', fontSize: '24px' }
            // });
            await driver.pause(3000);

            // await browserWithLogger.logToViewport('✅ Página cargada correctamente', {
            //     text: { color: 'green', fontSize: '20px' }
            // });
            await driver.pause(3000);

            const title = await driver.getTitle();
            console.log('Page title:', title);

            // await browserWithLogger.logToViewport(`📄 Título obtenido: ${title}`, {
            //     text: { color: 'purple', fontSize: '18px' }
            // });
            await driver.pause(5000);

            // Remover los mensajes del viewport
            // await browserWithLogger.removeViewportLogMessage();
            await driver.pause(2000);

            // await browserWithLogger.logToViewport('🧹 Test completado - Cerrando en 5 segundos', {
            //     text: { color: 'orange', fontSize: '16px' }
            // });

            await driver.pause(5000);
        } catch (error) {
            console.error('Test failed:', error);
        }
    });

    // test('should work with multiple services configured', async ({ driver }) => {
    //     // Si tienes múltiples servicios configurados, todos se inicializan automáticamente
    //     console.log('🔧 Testing multiple services integration...');

    //     // Los servicios se ejecutan en el orden correcto:
    //     // 1. Session.initializeGlobalServices (una vez por worker)
    //     // 2. session.createSession() que ejecuta beforeSession hooks
    //     // 3. session.deleteSession() que ejecuta afterSession hooks

    //     // Verificar que el driver está funcionando
    //     await driver.url('data:text/html,<h1>Test Page</h1>');

    //     const h1Text = await driver.$('h1').getText();
    //     expect(h1Text).toBe('Test Page');

    //     console.log('✅ Services integration working correctly');
    // });

    // test('services lifecycle management', async ({ driver, page }) => {
    //     // Test que muestra cómo los servicios se gestionan automáticamente en Session.ts
    //     console.log('🔄 Testing services lifecycle...');

    //     // Los servicios han sido inicializados antes de esta prueba
    //     // Session.createSession() ya ejecutó:
    //     // - beforeSession hooks
    //     // - beforeSessionWithDriver hooks (después de crear el driver)

    //     await driver.url('data:text/html,<title>Services Test</title><h1>Testing Services Lifecycle</h1>');

    //     const title = await driver.getTitle();
    //     expect(title).toBe('Services Test');

    //     // Al finalizar la prueba:
    //     // - Session.deleteSession() ejecutará afterSession hooks automáticamente
    //     // - Session.cleanupGlobalServices() se ejecutará al finalizar el worker

    //     console.log('✅ Services lifecycle test completed');
    // });
});
/**
 * Servicio simple de viewport logger que funciona sin Cucumber
 * Este es un Worker Service que se ejecuta por cada sesión WebDriverIO
 */
export class SimpleViewportLoggerService {
    private options: any;

    constructor(serviceOptions: any = {}) {
        this.options = {
            enabled: true,
            styles: {
                wrapper: { backgroundColor: 'rgba(0,0,0,0.8)' },
                text: { color: 'white', fontSize: '16px' },
                closeButton: { color: 'white' }
            },
            ...serviceOptions
        };
    }

    /**
     * Hook que se ejecuta después de crear la sesión del browser
     * Este es un Worker Hook, se ejecuta por cada sesión
     */
    before(config: any, specs: any, browser: WebdriverIO.Browser) {
        if (!this.options.enabled) return;

        console.log("🎯 SimpleViewportLoggerService: Inicializando comandos de viewport");

        // Agregar el comando logToViewport al browser
        browser.addCommand(
            'logToViewport',
            (message: string, customStyles?: any) => {
                return browser.execute(function(msg, styles, defaultStyles) {
                    // Esta función se ejecuta en el navegador
                    function renderMessage(message: any, styles: any = {}) {
                        // Remover mensaje anterior
                        const existing = document.querySelector('simple-viewport-logger');
                        if (existing) existing.remove();

                        // Crear wrapper
                        const wrapper = document.createElement('simple-viewport-logger');
                        const mergedStyles = { ...defaultStyles, ...styles };
                        
                        wrapper.style.cssText = `
                            position: fixed;
                            top: 10px;
                            left: 10px;
                            z-index: 999999;
                            padding: 15px 40px 15px 15px;
                            background-color: ${mergedStyles.wrapper?.backgroundColor || 'rgba(0,0,0,0.8)'};
                            color: ${mergedStyles.text?.color || 'white'};
                            font-size: ${mergedStyles.text?.fontSize || '16px'};
                            font-family: monospace;
                            border-radius: 5px;
                            max-width: 400px;
                            pointer-events: none;
                            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                        `;

                        // Botón de cerrar
                        const closeBtn = document.createElement('button');
                        closeBtn.innerHTML = '✕';
                        closeBtn.style.cssText = `
                            position: absolute;
                            top: 5px;
                            right: 5px;
                            background: none;
                            border: none;
                            color: ${mergedStyles.closeButton?.color || 'white'};
                            font-size: 16px;
                            cursor: pointer;
                            pointer-events: auto;
                        `;
                        closeBtn.onclick = () => wrapper.remove();

                        // Mensaje
                        const msgElement = document.createElement('div');
                        msgElement.textContent = message;

                        wrapper.appendChild(closeBtn);
                        wrapper.appendChild(msgElement);
                        document.body.appendChild(wrapper);
                    }

                    renderMessage(msg, styles);
                }, message, customStyles, this.options.styles);
            }
        );

        // Agregar comando para remover mensajes
        browser.addCommand(
            'removeViewportLogMessage',
            () => {
                return browser.execute(function() {
                    const wrapper = document.querySelector('simple-viewport-logger');
                    if (wrapper) wrapper.remove();
                });
            }
        );
    }

    /**
     * Hook que se ejecuta después de finalizar la sesión
     * Worker Hook para cleanup
     */
    after(result: any, config: any, capabilities: any) {
        console.log("🎯 SimpleViewportLoggerService: Limpieza completada");
    }
}

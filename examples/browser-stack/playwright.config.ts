import { defineConfig, devices } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
    testDir: './tests',
    outputDir: 'build/logs',
    timeout: 2 * 60 * 1000,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 4 : 0,
    reporter: [
        ['html', { outputFolder: 'build/runs', open: 'never' }],
        ['list', { printSteps: true }],
    ],
    workers: 1,
    fullyParallel: true,
    use: {
        takeScreenshot: true,
        // Configure BrowserStack - Manual
        config: {
            logLevel: 'info',
            protocol: 'https',
            hostname: 'hub.browserstack.com',
            path: '/wd/hub',
            port: 443,
            user: 'flavioromero_LxXH2F',
            key: '13pi4yRK9iirHKsj7PUQ',
            services: [
                ['browserstack', {

                    testObservability: false,
                    accessibility: false,
                    testObservabilityOptions: {
                        buildName: "bstack-demo",
                        projectName: "BrowserStack Sample",
                        buildTag: 'Any build tag goes here. For e.g. ["Tag1","Tag2"]'
                    },
                }]
            ],
        },
        capabilities: {
            platformName: 'Android',
            'appium:app': 'bs://bb6f76079e0a6566435c8b23e790f2b26cc7e34c',
            'bstack:options': {
                deviceName: 'Google Pixel 7 Pro',
                osVersion: '13.0',
                projectName: 'Demo Mobile',
                appiumVersion: '2.18.0',
            }
        }
    }
})
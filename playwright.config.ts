import { defineConfig, devices } from "@playwright/test";
import { TestOptions } from "./src";

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
        trace: 'off',
        screenshot: 'off',
        video: 'off',
        takeScreenshot: false,
        recordingScreen: false,
        config: {
            logLevel: 'info'
        },
        // capabilities: {},
        // services: []
    },
    projects: [
        {
            name: 'Browserstack',
            use: {
                // capabilities: {
                //     platformName: 'IOS',
                //     "appium:deviceName": "iPhone 16e Device 1",
                //     "appium:automationName": "XCUITest",
                //     "appium:bundleId": "org.reactjs.native.example.wdiodemoapp",
                //     "appium:udid": "CED003A3-85B7-4780-B42E-EA5BF16DB5BB",
                // }
                // CONFIGURACIÓN CORREGIDA PARA APP AUTOMATE
                config: {
                    user: process.env.BROWSERSTACK_USER || '',
                    key: process.env.BROWSERSTACK_KEY || ''
                },
                capabilities: {
                    platformName: 'Android',
                    'appium:automationName': 'UiAutomator2',
                    'appium:app': 'bs://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                    'bstack:options': {
                        deviceName: 'Samsung Galaxy S22',
                        osVersion: '12.0',
                        projectName: 'Oficial',
                        buildName: 'build-2',
                        video: false
                        // buildIdentifier: 'Identifier-1.1'
                    }
                },
                services: [
                    ["browserstack", {
                        app: 'bs://c4daf9681d4cfc3da98d9dff23a2dc096fb7a8f4',
                        accessibility: false,
                        testObservability: false,
                        testReporting: false,
                        // buildIdentifier: 'Identifier-1.1',
                    }]
                ]
}
        },
    {
        name: 'Playwright Desktop Chrome',
        use: {
            ...devices['Desktop Chrome']
        }
    },
    {
        name: 'appium',
    },
    {
        name: 'WebdriverIO Android 1',
        use: {
            capabilities: {
                platformName: 'Android',
                "appium:deviceName": "Emulador 5554",
                "appium:automationName": "UiAutomator2",
                "appium:appPackage": "com.wdiodemoapp",
                "appium:appActivity": ".MainActivity",
                "appium:udid": "emulator-5554"
            },
        }
    },
    {
        name: 'WebdriverIO Android 2',
        use: {
            capabilities: {
                platformName: 'Android',
                "appium:deviceName": "Xiaomi 15Pro",
                "appium:automationName": "UiAutomator2",
                "appium:appPackage": "com.wdiodemoapp",
                "appium:appActivity": ".MainActivity",
                "appium:udid": "QCD645HEEU5X5LLZ"
            },
        }
    },
    {
        name: 'WebdriverIO IOS 1',
        use: {
            capabilities: {
                platformName: 'IOS',
                "appium:deviceName": "iPhone 16e Device 1",
                "appium:automationName": "XCUITest",
                "appium:bundleId": "org.reactjs.native.example.wdiodemoapp",
                "appium:udid": "CED003A3-85B7-4780-B42E-EA5BF16DB5BB",
            }
        }
    },
    {
        name: 'WebdriverIO IOS 2',
        use: {
            capabilities: {
                platformName: 'IOS',
                "appium:deviceName": "iPhone 16 Device 2",
                "appium:automationName": "XCUITest",
                "appium:bundleId": "org.reactjs.native.example.wdiodemoapp",
                "appium:udid": "F3DF6CB0-AA6F-4DE2-9ED9-1FFE91F64AA0",
            }
        }
    }
    ]
})
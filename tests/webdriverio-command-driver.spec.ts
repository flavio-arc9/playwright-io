
import { expect } from '@playwright/test';
import { test, Key } from '../src';

test.use({
    config: {
        baseUrl: 'https://playwright.dev/',
    }
});

test.beforeEach(async ({ page, driver }) => {
    await driver.url('/')
});

test.describe('Wrap Command Driver API', { tag: '@webdriverio-command-test' }, () => {

    test('action', async ({ driver }) => {
        const key = driver.action('key')
        key.down(Key.F12)
        key.pause(1000)
        key.up(Key.F12)
        key.perform()

        const pointer = driver.action('pointer', {
            parameters: { pointerType: 'mouse' }
            // "mouse" is default value, also possible: "pen" or "touch"
        })

        pointer.down('left')
        pointer.down('right')
        pointer.move(100, 100)
        pointer.move({
            x: 200,
            y: 200,
            origin: 'viewport',
            duration: 1000
        })
        pointer.up('left')
        pointer.up({
            button: 'left',
        })
        pointer.cancel()
        pointer.pause(1000)
        pointer.perform()

        const wheel = driver.action('wheel').scroll({
            deltaX: 100,
            deltaY: 200,
            duration: 1000
        })
        wheel.perform()
    })

    test('actions', async ({ driver }) => {
        await driver.actions([
            driver.action('pointer')
                .down('left')
                .down('right')
                .move(100, 100)
                .move({
                    x: 200,
                    y: 200,
                    origin: 'viewport',
                    duration: 1000
                })
                .up('left'),
            driver.action('wheel')
                .scroll({
                    deltaX: 100,
                    deltaY: 200,
                    duration: 1000
                }),
        ])
    });

    test('addCommand', async ({ driver }) => {
        await driver.addCommand('getUrlAndTitle', async function (customParam) {
            return {
                url: await this.getUrl(),
                title: await this.getTitle(),
                customParam: customParam
            }
        });

        //@ts-ignore
        const result = await driver.getUrlAndTitle('foobar')

        expect(result.url).toEqual('https://playwright.dev/')
        expect(result.title).toEqual('Fast and reliable end-to-end testing for modern web apps | Playwright')
        expect(result.customParam).toEqual('foobar')
    });

    test('addInitScript', { annotation: { type: 'msg:', description: 'Only Bidi' } }, async ({ driver }) => {
        await driver.addInitScript((seed) => {
            Math.random = () => seed
        }, 42)

        await driver.url('https://webdriver.io')
    });

    test('call', async ({ driver }) => {
        const somePromiseLibrary = {
            someMethod: () => Promise.resolve('done')
        };

        const someOtherNodeLibrary = {
            someMethod: (param: any, cb: (err: any, res?: any) => void) => {
                // Simula una llamada asíncrona con callback
                setTimeout(() => {
                    if (param === 'fail') return cb(new Error('fail'));
                    cb(null, 'callback result');
                }, 100);
            }
        };

        await driver.url('http://google.com');

        // Uso con librería que retorna promesa
        await driver.call(() => {
            return somePromiseLibrary.someMethod().then((res) => {
                // Puedes hacer algo con res si quieres
                return res;
            });
        });

        // Uso con librería que usa callback
        const result = await driver.call(() => {
            return new Promise((resolve, reject) => {
                someOtherNodeLibrary.someMethod('ok', (err, res) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(res);
                });
            });
        });

        expect(result).toEqual('callback result');
    });

    test('custom$$', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.addLocatorStrategy('myStrategy', (selector) => {
            return document.querySelectorAll(selector)
        })

        const pluginWrapper = await driver.custom$$('myStrategy', '.pluginWrapper')
        expect(await pluginWrapper.length).toEqual(0);
    });

    test('custom$', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        driver.addLocatorStrategy('myStrat', (selector) => {
            return document.querySelectorAll(selector)
        })

        const projectTitle = await driver.custom$('myStrat', '.hero__subtitle')
        // expect(await projectTitle.getText()).toEqual('E2E and Unit / Component Testing in real Browser!');
        console.log(await projectTitle)
    });

    test('debug', async ({ driver }) => {
        await driver.url('https://webdriver.io');
        await driver.debug();
    });

    test('deleteCookies', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.deleteCookies();

        await driver.setCookies([
            { name: 'test3', value: '789' },
            { name: 'test2', value: '456' },
            { name: 'test', value: '123' }
        ])

        let cookies = await driver.getCookies()
        expect(cookies).not.toEqual(
            expect.arrayContaining([
                { name: 'test', value: '123' },
                { name: 'test2', value: '456' },
                { name: 'test3', value: '789' }
            ])
        )

        await driver.deleteCookies(['test3'])
        cookies = await driver.getCookies()
        expect(cookies).not.toEqual(
            expect.arrayContaining([
                { name: 'test', value: '123' },
                { name: 'test2', value: '456' }
            ])
        )
        await driver.deleteCookies();
        cookies = await driver.getCookies()
        expect(cookies).toEqual([])
    });

    test('emulate', { annotation: { type: 'msg:', description: 'Only Bidi' } }, async ({ driver }) => {
        await driver.emulate('geolocation', {
            latitude: 52.52,
            longitude: 13.39,
            accuracy: 100
        })
    })

    test('execute', async ({ driver }) => {
        await driver.url('https://playwright.dev/')
        const title = await driver.execute(() => {
            return document.title
        })
        expect(title).toBe('Fast and reliable end-to-end testing for modern web apps | Playwright')
    })

    test('executeAsync', async ({ driver }) => {
        await driver.url('https://playwright.dev/')
        const title = await driver.executeAsync((done) => {
            setTimeout(() => {
                done(document.title)
            }, 500)
        })
        expect(title).toBe('Fast and reliable end-to-end testing for modern web apps | Playwright')
    });

    test('getCookies', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.deleteCookies();

        await driver.setCookies([
            { name: 'test3', value: '789' },
            { name: 'test2', value: '456' },
            { name: 'test', value: '123' }
        ])

        const cookies = await driver.getCookies()
        expect(cookies).not.toEqual(expect.arrayContaining([
            { name: 'test', value: '123' },
            { name: 'test2', value: '456' },
            { name: 'test3', value: '789' }
        ]))
    });

    test('getPuppeteer', async ({ driver }) => {
        // WebDriver command
        await driver.url('https://webdriver.io')

        const puppeteerBrowser = await driver.getPuppeteer()
        // switch to Puppeteer
        const metrics = await driver.call(async () => {
            const pages = await puppeteerBrowser.pages()
            pages[0].setGeolocation({ latitude: 59.95, longitude: 30.31667 })
            return pages[0].metrics()
        })

        console.log(metrics.LayoutCount) // returns LayoutCount value
    });

    test('getWindowSize', async ({ driver }) => {
        const size = await driver.getWindowSize()
        expect(size).toHaveProperty('width')
        expect(size).toHaveProperty('height')
    });

    test('keys', async ({ driver }) => {
        // Navegar a una página con inputs
        await driver.url('https://the-internet.herokuapp.com/key_presses');

        // Crear inputs dinámicamente para el test
        await driver.execute(() => {
            const container = document.body;

            // Input para copiar
            const copyInput = document.createElement('input');
            copyInput.id = 'copy';
            copyInput.type = 'text';
            copyInput.placeholder = 'Text to copy';
            container.appendChild(copyInput);

            // Input para pegar
            const pasteInput = document.createElement('input');
            pasteInput.id = 'paste';
            pasteInput.type = 'text';
            pasteInput.placeholder = 'Paste here';
            container.appendChild(pasteInput);

            // Agregar algo de estilo para visibilidad
            [copyInput, pasteInput].forEach(input => {
                input.style.display = 'block';
                input.style.margin = '10px';
                input.style.padding = '10px';
                input.style.width = '300px';
                input.style.fontSize = '16px';
            });
        });

        const $copyInput = driver.$('#copy');

        // copies text from an input element
        await $copyInput.setValue('some text')
        await driver.keys([Key.Ctrl, 'a'])
        await driver.keys([Key.Ctrl, 'c'])

        // inserts text from clipboard into input element
        let $pasteInput = driver.$('#paste');
        await $pasteInput.click()
        await driver.keys([Key.Ctrl, 'v'])

        $pasteInput = driver.$('#paste');
        console.log("Mensaje:", await $pasteInput.getValue()) // outputs: "some text"
    })

    test('mock', { annotation: { type: 'msg:', description: 'Only Bidi' } }, async ({ driver }) => {
        // via static string
        const userListMock = await driver.mock('**' + '/users/list')
        // you can also specifying the mock even more by filtering resources
        // by request or response headers, status code, postData, e.g. mock only responses with specific
        // header set and statusCode
        const strictMock = await driver.mock('**', {
            // mock all json responses
            statusCode: 200,
            requestHeaders: { 'Content-Type': 'application/json' },
            responseHeaders: { 'Cache-Control': 'no-cache' },
            method: 'GET'
        })

        // comparator function
        const apiV1Mock = await driver.mock('**' + '/api/v1', {
            statusCode: (statusCode) => statusCode >= 200 && statusCode <= 203,
            method: (method) => method === 'GET',
            requestHeaders: (headers) => !!headers['Authorization'] && headers['Authorization'].startsWith('Bearer '),
            responseHeaders: (headers) => !!headers['Impersonation'],
        })
    });

    test('mockClearAll', { annotation: { type: 'msg:', description: 'Only Bidi' } }, async ({ driver }) => {
        const docMock = await driver.mock('**', {
            requestHeaders: { 'Content-Type': 'text/html' }
        })
        const jsMock = await driver.mock('**', {
            requestHeaders: { 'Content-Type': 'application/javascript' }
        })

        await driver.url('https://guinea-pig.webdriver.io/')
        console.log(docMock.calls.length, jsMock.calls.length) // returns "1 4"

        await driver.url('https://guinea-pig.webdriver.io/')
        console.log(docMock.calls.length, jsMock.calls.length) // returns "2 4" (JavaScript comes from cache)

        await driver.mockClearAll()
        console.log(docMock.calls.length, jsMock.calls.length)
    })

    test('newWindow', { annotation: { type: 'msg:', description: 'Only Browser' } }, async ({ driver }) => {
        await driver.url('https://google.com')
        console.log("Console1:", await driver.getTitle()) // outputs: "Google"

        const result = await driver.newWindow('https://webdriver.io', {
            windowName: 'WebdriverIO window',
            windowFeatures: 'width=420,height=230,resizable,scrollbars=yes,status=1',
        })
        console.log("Console2:", await driver.getTitle()) // outputs: "WebdriverIO · Next-gen driver and mobile automation test framework for Node.js"
        console.log("Windows:", result.type) // outputs: "window"
        const handles = await driver.getWindowHandles()
        await driver.switchToWindow(handles[1])
        await driver.closeWindow()
        await driver.switchToWindow(handles[0])
        console.log("Console3:", await driver.getTitle()) // outputs: "Google"
    })

    test('overwriteCommand', async ({ driver }) => {

        await driver.overwriteCommand('pause', function (origPauseFunction, ms) {
            console.log(`Sleeping for ${ms}`)
            origPauseFunction(ms)
            return ms
        })
    });

    test('pause', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.pause(1000)
    });

    test('react$$', async ({ driver }) => {
        await driver.url('https://yog9.github.io/SnapShot/#/SnapScout/mountain');

        const allReactElements = await driver.react$$('li');
        console.log(`Total React elements: ${allReactElements.length}`);

        const links = await driver.react$$('a');
        console.log(`Found ${links.length} React links`);
    });

    test('react$', async ({ driver }) => {
        // Usando Create React App demo - más confiable para testing
        await driver.url('https://create-react-app.dev/docs/getting-started');

        const linkElement = await driver.react$('a', {
            props: { href: '/docs/getting-started' }
        });

        expect(linkElement).toBeTruthy();
    });

    test('reloadSession', async ({ driver }) => {
        const id1 = driver.sessionId
        await driver.reloadSession()
        const id2 = driver.sessionId

        expect(id1).not.toBe(id2)
    });

    test('restore', { annotation: { type: 'msg:', description: 'Only Bidi' } }, async ({ driver }) => {
        await driver.emulate('geolocation', { latitude: 52.52, longitude: 13.405 })
        await driver.emulate('userAgent', 'foobar')
        await driver.emulate('colorScheme', 'dark')
        await driver.emulate('onLine', false)

        await driver.url('https://webdriver.io')
        await driver.restore()
    })

    test('savePDF', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.savePDF('./webdriver.pdf')
    });

    // test('saveRecordingScreen', async ({ driver }) => {
    //     await driver.startRecordingScreen();
    //     await driver.url('https://webdriver.io')
    //     await driver.saveRecordingScreen('./webdriver.mp4')
    // });

    test('saveScreenshot', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.saveScreenshot('./webdriver.png')
    });

    test('scroll', async ({ driver }) => {
        await driver.url('https://webdriver.io')

        console.log(await driver.execute(() => window.scrollY)) // returns 0
        await driver.scroll(0, 200)
        console.log(await driver.execute(() => window.scrollY)) // returns 200
    });

    test('setCookies', async ({ driver }) => {
        // set a single cookie
        await driver.setCookies({
            name: 'test1',
            value: 'one',
            // The below options are optional
            // path: '/foo', // The cookie path. Defaults to "/"
            // domain: '.example.com', // The domain the cookie is visible to. Defaults to the current browsing context’s active document’s URL domain
            // secure: true, // Whether the cookie is a secure cookie. Defaults to false
            // httpOnly: true, // Whether the cookie is an HTTP only cookie. Defaults to false
            // expiry: 1551393875 // When the cookie expires, specified in seconds since Unix Epoch
        })

        // set multiple cookies
        await driver.setCookies([
            { name: 'test2', value: 'two' },
            { name: 'test3', value: 'three' }
        ])

        const cookies = await driver.getCookies()
        console.log(cookies);
    });

    test('setTimeout', async ({ driver }) => {
        await driver.setTimeout({
            'pageLoad': 2000,
            'script': 10000
        });
        // The delay must be <= 10000 ms
        await driver.executeAsync((done) => {
            console.log('Wake me up before you go!');
            setTimeout(done, 9000);
        });
    });

    test('setViewport', async ({ driver }) => {
        await driver.setViewport({ width: 1280, height: 720, devicePixelRatio: 1 });
    });

    test('setWindowSize', async ({ driver }) => {
        await driver.setWindowSize(1280, 720);
    });

    test('switchWindow', async ({ driver }) => {
        // open url
        await driver.url('https://google.com')

        // get window handle
        const handle = await driver.getWindowHandle()

        // create new window
        await driver.newWindow('https://webdriver.io')

        // switch back via url match
        await driver.switchWindow('google.com')

        // switch back via title match
        await driver.switchWindow('WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO')

        // switch back via window handle
        await driver.switchWindow(handle)
    });

    test('throttle', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.throttle({ downloadThroughput: 100 * 1024, uploadThroughput: 100 * 1024, latency: 100, offline: true })
        console.log(await driver.execute(() => window.navigator.onLine)) // returns false
    });

    test('throttleCPU', async ({ driver }) => {
        await driver.throttleCPU(2) // 2x slowdown
    });

    test('throttleNetwork', async ({ driver }) => {
        // via static string preset
        await driver.throttleNetwork('Regular3G')

        // via custom values
        await driver.throttleNetwork({
            offline: false,
            downloadThroughput: 200 * 1024 / 8,
            uploadThroughput: 200 * 1024 / 8,
            latency: 20
        })
    });

    test('waitUntil', async ({ driver }) => {
        await driver.url('https://webdriver.io')
        await driver.waitUntil(async () => {
            const title = await driver.getTitle();
            return title === 'WebdriverIO · Next-gen browser and mobile automation test framework for Node.js | WebdriverIO';
        }, { timeout: 10000 });
    });
});
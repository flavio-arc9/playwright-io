No se recomienda utilizar el trace se recomienda que siempre este apagado
No se recomienda usar el grabador de video recordingScreen 
Se recomienda que siempre ejecute en headless mode si no es en local
https://www.browserstack.com/docs/app-automate/appium/getting-started/nodejs/webdriverio/integrate-your-tests
## BrowserStack development
```ts
config: {
    protocol: 'https',
    hostname: 'hub.browserstack.com',
    path: '/wd/hub',
    port: 443,
}
```

## Capabilities
```ts
{
  'appium:deviceName': 'moto g51 5G',
  'appium:platformVersion': '13.0',
  'appium:app': 'bs://<app-id>',
  'bstack:options': {
      'interactiveDebugging': true,
      'appiumVersion': '2.6.0',
      'userName': '<username>',
      'accessKey': '<token-key>',
      'networkLogs': true,
  }
}
```

> [Mayor Información](https://www.browserstack.com/docs/app-automate/capabilities)
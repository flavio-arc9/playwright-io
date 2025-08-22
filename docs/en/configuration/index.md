# ⚙️ Configuration

In this section we'll teach you how to configure `playwright.config.ts` for different projects: **browser**, **Android** and **iOS**. The configuration **must always extend** `TestOptions` from **playwright-io**.

> The configuration **ALWAYS** must use `defineConfig<TestOptions>()` to have access to playwright-io functionalities.

## Basic Structure

```ts
import { defineConfig } from "@playwright/test";
import { TestOptions } from "playwright-io";

export default defineConfig<TestOptions>({
    testDir: './tests',
    use: {
        // playwright-io specific configuration
        capabilities: { /* ... */ },
        config: { /* ... */ },
        takeScreenshot: true,
        recordingScreen: false
    }
});
```


## Configuration Guides

1. **[📱 Project Configuration](en/configuration/projects.md)** - Global, per project and parallel execution
2. **[🔧 Available Options](en/configuration/options.md)** - All playwright-io configuration options
3. **[🧪 Write First Test](en/getting-started/write-first-test.md)** - Using configuration in tests

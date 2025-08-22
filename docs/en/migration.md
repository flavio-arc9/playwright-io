# 🔄 Migration Guide

Quick guide for migrating to **playwright-io**.

---

## **From playwright-webdriverio**

### Step 1: Update Package
```bash
npm uninstall playwright-webdriverio
npm install playwright-io --save-dev
```

### Step 2: Change Imports
```typescript
// Before
import { test } from 'playwright-webdriverio';

// Now
import { test } from 'playwright-io';
```

### Step 3: Configuration (optional)
Your current configuration will continue to work. For new features:

```typescript
// playwright.config.ts
export default defineConfig<TestOptions>({
    workers: 4, // ✅ Parallel execution
    use: {
        // Your current configuration...
        capabilities: { /* ... */ },

        // ✅ New options (optional)
        recordingScreen: true,
        takeScreenshot: true
    }
});
```

### Step 4: Done!
All your current code will work the same. Optionally, you can use the global driver:

```typescript
// Before (still works)
test('my test', async ({ driver }) => {
    await driver.$('#button').click();
});

// New (optional)
test('my test', async () => { 
    await driver.$('#button').click(); // Without fixture
});
```

## **Common problems**

### Error: "driver is not defined"
Verify that you have the basic configuration:

```typescript
// playwright.config.ts
export default defineConfig({ 
    use: { 
        capabilities: { 
            platformName: 'Android', // or 'iOS' 
            // ... your capabilities 
        } 
    }
});
```

### TypeScript
Add the global type:

```json
// tsconfig.json
{ 
    "compilerOptions": { 
        "types": ["playwright-io", "@playwright/test"] 
    }
}
```
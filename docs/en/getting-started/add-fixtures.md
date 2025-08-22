# 🔧 Extending with Custom Fixtures

As your mobile tests grow, you'll need [custom fixtures](https://playwright.dev/docs/test-fixtures) to reuse code and configurations. In **playwright-io**, you can extend base fixtures using `mergeTests`.

---

## 🎯 What are Fixtures?

Fixtures are reusable dependencies that run before and after each test:

- **Test data** - Specific configurations per test  
- **Page Objects** - Shared instances of your pages
- **Setup/Teardown** - Initial state configuration

---

## 🏗️ Basic Setup

### Option 1: Simple fixtures (playwright-io only)

Create `tests/fixtures.ts`:

```typescript
import { test as base } from "playwright-io";

// Define custom fixture for login data
export const test = base.extend<{
  loginData: { email: string; password: string };
}>({
    loginData: async ({}, use) => {
        const data = {
        email: 'test@webdriver.io',
        password: 'Test1234!'
        };
        await use(data);
    }
});
```

### Option 2: Combining with other libraries (mergeTests)

If you use **playwright-bdd** or other libraries that extend Playwright, use `mergeTests`:

```typescript
import { test as base, createBdd } from 'playwright-bdd';
import { test as mobile } from 'playwright-io';
import { mergeTests } from '@playwright/test';

// Create custom fixtures
const customTest = base.extend<{
  loginData: { email: string; password: string };
}>({
    loginData: async ({}, use) => {
        const data = {
			email: 'test@webdriver.io',
			password: 'Test1234!'
        };
        await use(data);
    }
});

// Merge all tests: base + mobile + custom
export const test = mergeTests(base, mobile, customTest);
export { expect } from '@playwright/test';
```

---

## 📱 Complete Example with Page Objects

Create `tests/fixtures/index.ts`:

```typescript
import { test as base } from "playwright-io";
import { LoginPage } from "../pageobjects/LoginPage";

// Define fixture types
interface CustomFixtures {
  loginData: { email: string; password: string };
  loginPage: LoginPage;
}

// Extend with custom fixtures
export const test = base.extend<CustomFixtures>({
  	loginData: async ({}, use) => {
		const data = {
			email: 'test@webdriver.io',
			password: 'Test1234!'
		};
		await use(data);
  	},

  	loginPage: async ({ page }, use) => {
    	const loginPage = new LoginPage(page);
    	await use(loginPage);
  	}
});

export { expect } from "playwright-io";
```

### Using in your tests

Update `tests/login.spec.ts`:

```typescript
import { test, expect } from './fixtures';

test.describe('Login Tests with Fixtures', () => {

	test.beforeEach(async ({ page }) => {
		await page.locator$('~Home').waitForDisplayed({ timeout: 20000 });
		await page.locator$('~Login').click();
		await page.locator$('~Login-screen').waitForDisplayed();
	});

	test('should login successfully with fixture data', async ({ 
		loginPage, 
		loginData 
	}) => {
		await loginPage.login(loginData.email, loginData.password);
		await loginPage.waitForAlert();
		
		const alertMessage = await loginPage.getAlertMessage();
		await expect(alertMessage).toContain('You are logged in!');
		
		await loginPage.closeAlert();
	});
});
```

---

## 🎯 Best Practices

### 1. **Organize fixtures by functionality**
```
tests/fixtures/
├── index.ts          # Main fixture exports
├── authFixtures.ts   # Authentication related
├── dataFixtures.ts   # Test data fixtures
└── pageFixtures.ts   # Page object fixtures
```

### 2. **Use TypeScript for type safety**
```typescript
interface LoginData {
	email: string;
	password: string;
	rememberMe?: boolean;
}

export const test = base.extend<{ loginData: LoginData }>({
  // Implementation
});
```

### 3. **Scope fixtures appropriately**
```typescript
// Worker scope - shared across all tests in the worker
export const test = base.extend<{}, { sharedConfig: Config }>({
	sharedConfig: [async ({}, use) => {
		const config = await loadConfig();
		await use(config);
	}, { scope: 'worker' }]
});
```

---

## 📖 Next Steps

- 📝 **[API Reference](en/api/index.md)** - Explore all available methods
- ⚙️ **[Configuration](en/configuration/index.md)** - Configure your testing environment  
- 🔍 **[Prerequisites](en/prerequisites/index.md)** - Set up your development environment

import { test as base, Browser, expect } from '@playwright/test';
import { BASE_URL } from '../const';

const AuthCreds = {
    Alice: {
        email: 'alice@xyz.com',
        password: 'Testing123'
    },
    Bob: {
        email: 'bob@xyz.com',
        password: 'Testing123'
    },
    Josh: {
        email: 'josh@xyz.com',
        password: 'Testing123'
    },
    User: {
        email: 'user@xyz.com',
        password: 'Testing123'
    }
};

export type FakeUser = keyof typeof AuthCreds;

export class Auth {
    constructor(private readonly browser: Browser) {}

    async authenticate(user: FakeUser) {
        const ctx = await this.browser.newContext();
        const page = await ctx.newPage();
        await page.goto(BASE_URL);
        await page.getByText('Join the game').click();

        await page.waitForLoadState('domcontentloaded');

        await page.getByLabel('Email address*').fill(AuthCreds[user].email);
        await page.getByLabel('Password*').fill(AuthCreds[user].password);

        await page
            .getByRole('button', { name: 'Continue', exact: true })
            .click();

        await expect(
            page.getByRole('button', { name: 'Log out' })
        ).toBeVisible({timeout: 30000});

        return page;
    }
}

export const testWithAuth = base.extend<{
    /**
     * Basic auth fixture for storing/restoring authentication state
     */
    auth: Auth;
}>({
    auth: async ({ browser }, use) => {
        const auth = new Auth(browser);
        await use(auth);
    }
});

import { test as base, Browser, BrowserContext, Page } from '@playwright/test';

const AuthFile = {
    Alice: '../../.auth/alice.json',
    Bob: '../../.auth/bob.json',
    Josh: '../../.auth/josh.json',
    User: '../../.auth/avg_user.json'
};

export type FakeUser = keyof typeof AuthFile;

export class Auth {
    private _ctx: BrowserContext;

    constructor(
        private readonly _page: Page,
        private readonly _browser: Browser
    ) {}

    async authenticate(email: string, password: string, user: FakeUser) {
        await this._page.goto('http://localhost:3000/');
        await this._page.getByText('Join the game').click();

        await this._page.waitForLoadState('domcontentloaded');

        await this._page.getByLabel('Email address*').fill(email);
        await this._page.getByLabel('Password*').fill(password);

        await this._page
            .getByRole('button', { name: 'Continue', exact: true })
            .click();

        await this._page.context().storageState({ path: AuthFile[user] });
    }

    async useAuth(user: FakeUser) {
        this._ctx = await this._browser.newContext({
            storageState: AuthFile[user]
        });

        const page = await this._ctx.newPage();
        await page.goto('http://localhost:3000');

        await page.getByText('Join the game').click();
        await page.waitForLoadState('domcontentloaded');

        return page;
    }

    async cleanCtx() {
        await this._ctx.close();
    }
}

export const testWithAuth = base.extend<{ auth: Auth }>({
    auth: async ({ page, browser }, use) => {
        const auth = new Auth(page, browser);
        await use(auth);
        auth.cleanCtx();
    }
});

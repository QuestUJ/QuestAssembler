import {
    test as base,
    Browser,
    BrowserContext,
    expect,
    Page
} from '@playwright/test';
import { BASE_URL } from '../const';

const AuthFile = {
    Alice: '.auth/alice.json',
    Bob: '.auth/bob.json',
    Josh: '.auth/josh.json',
    User: '.auth/avg_user.json'
};

export type FakeUser = keyof typeof AuthFile;

export function getAuth(user: FakeUser) {
    return AuthFile[user]
}

export class Auth {
    private ctx: BrowserContext;

    constructor(
        private readonly page: Page,
        private readonly browser: Browser
    ) { }

    async authenticate(email: string, password: string, user: FakeUser) {
        await this.page.goto(BASE_URL);
        await this.page.getByText('Join the game').click();

        await this.page.waitForLoadState('domcontentloaded');

        await this.page.getByLabel('Email address*').fill(email);
        await this.page.getByLabel('Password*').fill(password);

        await this.page
            .getByRole('button', { name: 'Continue', exact: true })
            .click();

        const logout = this.page.getByRole('button', {
            name: 'Log Out'
        });

        await expect(logout).toBeVisible();

        await this.page.context().storageState({ path: AuthFile[user] });
    }

    /**
     * simple helper for using fake authenticated user
     * @param user {FakeUser} which user should be authenticated
     * @returns page with authenticated as {user} page
     */
    async useAuth(user: FakeUser): Promise<Page> {
        this.ctx = await this.browser.newContext({
            storageState: AuthFile[user]
        });

        const page = await this.ctx.newPage();
        await page.goto(BASE_URL);

        await page.getByText('Join the game').click();
        await page.waitForLoadState('domcontentloaded');

        return page;
    }

    async cleanCtx() {
        if (!!this.ctx) {
            await this.ctx.close();
        }
    }
}

export const testWithAuth = base.extend<{
    /**
     * Basic auth fixture for storing/restoring authentication state
     */
    auth: Auth;
}>({
    auth: async ({ page, browser }, use) => {
        const auth = new Auth(page, browser);
        await use(auth);
        await auth.cleanCtx();
    }
});

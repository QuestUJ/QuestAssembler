import test, { expect } from '@playwright/test';
import { testWithAuth } from './fixtures/Auth';

testWithAuth.describe('Landing page', () => {
    testWithAuth(
        'should redirect to dashboard after clicking join buttton',
        async ({ browser, auth }) => {
            const page = await auth.useAuth('Josh');
            const context = await browser.newContext({
                storageState: '../.auth/josh.json'
            });

            await context.storageState({
                path: '../.auth/josh.json'
            });

            await page.getByText('Join the game').click();
            await page.waitForLoadState('domcontentloaded');
            expect(page.url).toMatch(/\/dashboard/);
        }
    );
});

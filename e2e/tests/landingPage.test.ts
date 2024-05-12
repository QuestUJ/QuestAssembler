import { expect } from '@playwright/test';
import { testWithAuth } from './fixtures/Auth';
import { BASE_URL } from './const';

testWithAuth.describe('[FM1] Landing page', () => {
    testWithAuth(
        'should redirect to dashboard after clicking join buttton',
        async ({ auth }) => {
            const page = await auth.useAuth('Josh');

            await page.goto(BASE_URL);
            await page.getByText('Join the game').click();
            await page.waitForLoadState('domcontentloaded');
            expect(page.url()).toMatch(/\/dashboard/);
        }
    );
});

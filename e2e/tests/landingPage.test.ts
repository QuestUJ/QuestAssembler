import { expect } from '@playwright/test';
import { testWithAuth } from './fixtures/Auth';
import { BASE_URL } from './const';

testWithAuth.describe('[FM1] Landing page', () => {
    testWithAuth(
        'should redirect to dashboard after clicking join buttton',
        async ({ auth }) => {
            const page = await auth.authenticate('User');

            expect(page.url()).toMatch(/\/dashboard/);
        }
    );

    testWithAuth(
        'should redirect to landing page if not logged in',
        async ({ page }) => {
            await page.goto(`${BASE_URL}/dashboard`);

            await expect(page.getByLabel('Email address*')).toBeVisible();
            await expect(page.getByLabel('Password*')).toBeVisible();
        }
    );
});

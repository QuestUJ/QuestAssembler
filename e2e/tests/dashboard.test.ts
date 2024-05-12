import { expect } from '@playwright/test';
import { testWithRooms } from './fixtures/Room';
import { randomBytes } from 'crypto';
import { BASE_URL } from './const';

testWithRooms.describe('[FM3, FM4] Dashboard', () => {
    // testWithRooms.describe.configure({ mode: 'serial' });

    testWithRooms('should be able to create a game', async ({ auth }) => {
        const page = await auth.useAuth('User');

        const createGameButton = page.getByRole('button', {
            name: 'Create game'
        });

        await expect(createGameButton).toBeVisible();
        await expect(createGameButton).toBeInViewport();

        await createGameButton.click();

        const roomName = page.getByPlaceholder('Room name');

        const maxPlayers = page.getByPlaceholder('Max amount of players');

        await expect(roomName).toBeVisible();
        await expect(roomName).toBeInViewport();
        await expect(maxPlayers).toBeVisible();
        await expect(maxPlayers).toBeInViewport();

        const rnd = randomBytes(10).toString('base64');
        await roomName.fill(rnd);
        await maxPlayers.fill('10');

        await page
            .getByRole('button', {
                name: 'Create'
            })
            .click();

        await page.reload();
        await page.waitForLoadState('load');

        const roomCard = page.getByText(rnd);

        await expect(roomCard).toBeVisible({ timeout: 20000 });
    });

    testWithRooms(
        'should be able to get into the room',
        async ({ auth, room }) => {
            const page = await auth.useAuth('User');

            const name = randomBytes(10).toString('base64');
            await room.createRoom('User', name, 5);

            await page.reload();

            const roomCard = page.getByText(name);
            await roomCard.click();

            expect(page.url()).toMatch(new RegExp(`${BASE_URL}/.+`));
        }
    );

    testWithRooms('should be able to sign out', async ({ auth }) => {
        const page = await auth.useAuth('User');

        await page.getByRole('button', { name: 'Log out' }).click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch(BASE_URL);
        await expect(page.getByText('Join the game')).toBeVisible();
    });

    testWithRooms(
        'should be able to join the game',
        async ({ page, browser }) => {
            await page.goto(BASE_URL);
            await page.getByRole('button', { name: 'Join the game' }).click();
            await page.getByLabel('Email address*').click();
            await page.getByLabel('Email address*').fill('bob');
            await page.getByLabel('Email address*').click();
            await page.getByLabel('Email address*').fill('bob@xyz.com');
            await page.getByLabel('Email address*').press('Tab');
            await page.getByLabel('Password*').fill('Testing123');
            await page.getByLabel('Password*').press('Enter');

            await page.getByRole('button', { name: 'Create Game' }).click();
            await page.getByPlaceholder('Room name').click();

            const roomName = randomBytes(10).toString('base64');
            await page.getByPlaceholder('Room name').fill(roomName);
            await page.getByPlaceholder('Max amount of players').click();
            await page.getByPlaceholder('Max amount of players').fill('10');
            await page.getByRole('button', { name: 'Create game' }).click();
            await page.getByRole('link', { name: roomName }).click();
            const gameCode = page.url().split('/').pop();

            const userCtx = await browser.newContext();
            const userPage = await userCtx.newPage();
            await userPage.goto(BASE_URL);

            await userPage.goto('http://localhost:3001/');
            await userPage
                .getByRole('button', { name: 'Join the game' })
                .click();
            await userPage.getByLabel('Email address*').click();
            await userPage.getByLabel('Email address*').fill('user@xyz.com');
            await userPage.getByLabel('Email address*').press('Tab');
            await userPage.getByLabel('Password*').fill('Testing123');
            await userPage
                .getByRole('button', { name: 'Continue', exact: true })
                .click();
            await userPage.getByRole('button', { name: 'Join Game' }).click();
            await userPage.getByPlaceholder('Game code').click();
            await userPage.getByPlaceholder('Game code').fill(gameCode!);
            await userPage.getByRole('button', { name: 'Join game' }).click();
            await userPage.getByRole('link', { name: roomName }).click();
            await userPage.getByRole('button', { name: 'Players' }).click();
            await expect(
                userPage.getByRole('link', { name: 'bob' })
            ).toBeVisible();

            await page.getByRole('button', { name: 'Players' }).click();
            await expect(
                page.getByRole('link', { name: 'user' })
            ).toBeVisible();
        }
    );
});

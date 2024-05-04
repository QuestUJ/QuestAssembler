import { expect } from '@playwright/test';
import { testWithRooms } from './fixtures/Room';
import { randomBytes } from 'crypto';

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

        await expect(roomCard).toBeVisible();
    });

    testWithRooms('should be able to get into the room', async ({ auth }) => {
        const page = await auth.useAuth('User');

        const roomCard = page.getByText('Test room');
        await roomCard.click();

        expect(page.url).toMatch(/http:\/\/localhost:3000\/.+/);
        expect(page.getByText('Test room')).toBeVisible();
    });

    testWithRooms('should be able to sign out', async ({ auth }) => {
        const page = await auth.useAuth('User');

        await page.getByRole('button', { name: 'Log out' }).click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch('http://localhost:3000/');
        await expect(page.getByText('Join the game')).toBeVisible();
    });

    testWithRooms('should be able to join the game', async ({ room, auth }) => {
        await room.createRoom('Bob', 'Bob room', 10);
        const bob = await auth.useAuth('Bob');
        const user = await auth.useAuth('User');

        await bob.goto('http://localhost:3000/dashboard');
        await bob.getByText('Bob room').click();

        bob.getByRole('button', { name: 'Invite to game' });
        const gameCode = await bob.getByTestId('game-code').textContent();

        expect(gameCode).toBeTruthy();

        await user.getByRole('button', { name: 'Join game' }).click();

        await user.getByRole('textbox', { name: 'Game code' }).fill(gameCode!);
        await user.getByRole('button', { name: 'Join' }).click();

        user.waitForLoadState('domcontentloaded');
        expect(user.getByText('Bob room')).toBeVisible();
    });
});

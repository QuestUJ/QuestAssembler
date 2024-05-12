import { expect } from '@playwright/test';
import { testWithRooms } from './fixtures/Room';
import { randomBytes } from 'crypto';
import { BASE_URL } from './const';

testWithRooms.describe('[FM3, FM4] Dashboard', () => {
    testWithRooms('should be able to create a game', async ({ auth }) => {
        const page = await auth.authenticate('User');

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

    testWithRooms(
        'should be able to get into the room',
        async ({ auth, room }) => {
            const page = await auth.authenticate('User');

            const name = randomBytes(11).toString('base64');
            await room.createRoom(page, name, 5);

            await page.reload();

            const roomCard = page.getByText(name);
            await roomCard.click();

            expect(page.url()).toMatch(new RegExp(`${BASE_URL}/.+`));
        }
    );

    testWithRooms('should be able to sign out', async ({ auth }) => {
        const page = await auth.authenticate('User');

        await page.getByRole('button', { name: 'Log out' }).click();
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toMatch('http://localhost:3000'); // Auth0 callback
        await expect(page.getByText('Join the game')).toBeVisible();
    });

    testWithRooms('should be able to join the game', async ({ auth, room }) => {
        const bob = await auth.authenticate('Bob');
        const user = await auth.authenticate('User');
        const name = randomBytes(10).toString('base64');

        await room.createRoom(bob, name, 5);

        await bob.getByRole('link', { name }).click();

        await bob.getByRole('button', { name: 'Players' }).click();

        const gameCode = await room.getRoomCode(bob);

        await room.joinRoom(user, gameCode);

        await expect(bob.getByRole('link', { name: 'user' })).toBeVisible();
        const userRoom = user.getByRole('link', { name });
        await expect(userRoom).toBeVisible();
        await userRoom.click();
        await expect(user.getByText(name)).toBeVisible();
    });
});

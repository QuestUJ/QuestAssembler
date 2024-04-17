import test, { Page, expect } from '@playwright/test';
import { FakeUser, testWithAuth } from './Auth';

type Pages = Record<FakeUser, Page>;

export class Room {
    constructor(private readonly _pages: Pages) {}

    /**
     * helper for creating room, specify who is the owner, the name, and max players
     */
    async createRoom(who: FakeUser, roomName: string, maxPlayers: number) {
        const page = this._pages[who];
        const createGameButton = page.getByRole('button', {
            name: 'Create game'
        });

        await createGameButton.click();

        const roomNameInput = page.getByRole('textbox', {
            name: 'Room name'
        });
        const maxPlayersInput = page.getByRole('textbox', {
            name: 'Maximum number of players'
        });

        await roomNameInput.fill(roomName);
        await maxPlayersInput.fill(maxPlayers.toString());

        await page
            .getByRole('button', {
                name: 'Create'
            })
            .click();
    }

    /**
     * helper for joining specified user to room, you need to provider the room owner, the user, and roomName
     */
    async joinRoom(owner: FakeUser, user: FakeUser, roomName: string) {
        const ownerPage = this._pages[owner];
        const userPage = this._pages[user];

        await ownerPage.goto('http://localhost:3000/dashboard');
        await ownerPage.getByText(roomName).click();

        ownerPage.getByRole('button', { name: 'Invite to game' });
        const gameCode = await ownerPage.getByTestId('game-code').textContent();

        await userPage.getByRole('button', { name: 'Join game' }).click();

        await userPage
            .getByRole('textbox', { name: 'Game code' })
            .fill(gameCode!);
        await userPage.getByRole('button', { name: 'Join' }).click();

        userPage.waitForLoadState('domcontentloaded');
    }
}

export const testWithRooms = testWithAuth.extend<{
    /**
     * Fixture with room utilities
     */
    room: Room;
}>({
    room: async ({ auth }, use) => {
        const bobPage = await auth.useAuth('Bob');
        const joshPage = await auth.useAuth('Josh');
        const alicePage = await auth.useAuth('Alice');
        const userPage = await auth.useAuth('User');

        const room = new Room({
            Bob: bobPage,
            Josh: joshPage,
            Alice: alicePage,
            User: userPage
        });

        await use(room);
    }
});
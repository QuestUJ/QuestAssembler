import { Page } from '@playwright/test';
import { testWithAuth } from './Auth';
import { BASE_URL } from '../const';

export class Room {
    /**
     * helper for creating room, specify who is the owner, the name, and max players
     */
    async createRoom(page: Page, roomName: string, maxPlayers: number) {
        await page.goto(`${BASE_URL}/dashboard`);
        await page.waitForLoadState('load');
        const createGameButton = page.getByRole('button', {
            name: 'Create game'
        });

        await createGameButton.click();

        const roomNameInput = page.getByPlaceholder('Room name');
        const maxPlayersInput = page.getByPlaceholder('Max amount of players');

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
    async getRoomCode(ownerPage: Page) {
        return ownerPage.url().split('/').pop()!;
    }

    async joinRoom(page: Page, gameCode: string) {
        await page.getByRole('button', { name: 'Join game' }).click();

        await page.getByRole('textbox', { name: 'Game code' }).fill(gameCode!);
        await page.getByRole('button', { name: 'Join' }).click();
    }

    async sendMessage(page: Page, to: string, content: string) {
        await page.getByRole('link', { name: to }).click();
        await page.getByPlaceholder('Type your message here...').click();
        await page.getByPlaceholder('Type your message here...').fill(content);
        await page.getByRole('button', { name: 'Send' }).click();
    }
}

export const testWithRooms = testWithAuth.extend<{
    /**
     * Fixture with room utilities
     */
    room: Room;
}>({
    room: async ({}, use) => {
        const room = new Room();

        await use(room);
    }
});

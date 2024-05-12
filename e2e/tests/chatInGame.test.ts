import { expect } from '@playwright/test';
import { testWithRooms } from './fixtures/Room';
import { BASE_URL } from './const';

const testRoom = 'Room for chat testing';

testWithRooms.describe('Chat in game', () => {
    testWithRooms.beforeAll(async ({ room }) => {
        await room.createRoom('Bob', testRoom, 30);
        await room.joinRoom('Bob', 'Josh', testRoom);
        await room.joinRoom('Bob', 'Alice', testRoom);
    });

    testWithRooms(
        'should be able to communicate between players',
        async ({ auth }) => {
            const josh = await auth.useAuth('Josh');
            const alice = await auth.useAuth('Alice');

            const msg = 'Testing message 123 123';

            await josh.goto(`${BASE_URL}/dashboard`);
            await josh.getByText(testRoom).click();
            await josh.getByText('Alice').click();
            await josh.getByRole('textbox', { name: 'Message' }).fill(msg);
            await josh.getByRole('button', { name: 'send' }).click();

            await alice.goto(`${BASE_URL}/dashboard`);
            await alice.getByText(testRoom).click();
            await alice.getByText('Josh').click();

            await expect(alice.getByText(msg)).toBeVisible();
        }
    );
});

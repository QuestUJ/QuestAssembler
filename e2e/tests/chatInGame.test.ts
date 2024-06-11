import { expect } from '@playwright/test';
import { testWithRooms } from './fixtures/Room';
import { randomBytes } from 'crypto';

testWithRooms.describe('[FM2, FS2] Chat in game', () => {
    testWithRooms(
        'should be able to communicate between players',
        async ({ auth, room }) => {
            const bob = await auth.authenticate('Bob');
            const josh = await auth.authenticate('Josh');
            const alice = await auth.authenticate('Alice');

            const roomName = randomBytes(10).toString('base64');
            await room.createRoom(bob, roomName, 4);

            await bob.getByRole('link', { name: roomName }).click();

            const gameCode = await room.getRoomCode(bob);

            await room.joinRoom(josh, gameCode);
            await room.joinRoom(alice, gameCode);

            await josh.getByRole('link', { name: roomName }).click();
            await alice.getByRole('link', { name: roomName }).click();

            await bob.getByRole('button', { name: 'Players' }).click();
            await josh.getByRole('button', { name: 'Players' }).click();
            await alice.getByRole('button', { name: 'Players' }).click();

            await room.sendMessage(alice, 'josh', 'Hello from alice');
            await room.sendMessage(bob, 'josh', 'Secret message to josh');
            await room.sendMessage(josh, 'bob', 'Secret message to bob');

            const bobMessages = bob.getByTestId('messages');
            const joshMessages = josh.getByTestId('messages');
            const aliceMessges = alice.getByTestId('messages');

            await expect(
                bobMessages.getByText('Secret message to josh')
            ).toBeVisible();
            await expect(
                bobMessages.locator('p:has-text("Secret message to bob")')
            ).toBeVisible();

            await expect(
                joshMessages.getByText('Secret message to josh')
            ).toBeVisible();
            await expect(
                joshMessages.getByText('Secret message to bob')
            ).toBeVisible();

            await expect(
                aliceMessges.getByText('Hello from alice')
            ).toBeVisible();
            await expect(
                aliceMessges.getByText('Secret message to josh')
            ).not.toBeVisible();
        }
    );
});

import {  testWithAuth as setup } from '../fixtures/Auth';

setup('authenticate bob - Game master', async ({ auth }) => {
    await auth.authenticate('bob@xyz.com', 'Testing123', 'Bob');
});

setup('authenticate josh - Player 1', async ({ auth }) => {
    await auth.authenticate('josh@xyz.com', 'Testing123', 'Josh');
});

setup('authenticate alice - Player 2', async ({ auth }) => {
    await auth.authenticate('alice@xyz.com', 'Testing123', 'Alice');
});

setup('authenticate basic user', async ({ auth }) => {
    await auth.authenticate('user@xyz.com', 'Testing123', 'User');
});

import { IAuthProvider, UserDetails } from './IAuthProvider';

interface Config {
    domain: string;
    audience: string;
}

export class Auth0Provider implements IAuthProvider {
    constructor(config: Config) {
        config;
    }

    async verify(token: string): Promise<UserDetails> {
        token;
        await new Promise(resolve => {
            resolve('');
        });
        return {
            userID: 'ljksdlfkj@lkjsdflksdj'
        };
    }
}

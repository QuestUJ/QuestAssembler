import { IAuthProvider, UserDetails } from './IAuthProvider';

export class Auth0Provider implements IAuthProvider {
    verify(token: string): UserDetails {
        token;
        return {
            email: 'ljksdlfkj@lkjsdflksdj'
        };
    }
}

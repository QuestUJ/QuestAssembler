import { UserDetails } from '@quasm/common';

export interface IAuthProvider {
    /**
     * Verifies token and returns UsersDetails, throws on failed verification
     */
    verify(token: string): Promise<UserDetails>;
}

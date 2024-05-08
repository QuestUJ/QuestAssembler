import { UserDetails } from '@quasm/common';

export interface IAuthProvider {
    /**
     * Verifies token and returns userID, throws on failed verification
     */
    verify(token: string): Promise<string>;

    /**
     * Retrieves userDetails based on access token (doesn't validate the token')
     */
    fetchUserDetails(token: string): Promise<UserDetails>;
}

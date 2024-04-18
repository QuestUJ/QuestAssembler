export interface UserDetails {
    userID: string;
}

export interface IAuthProvider {
    /**
     * Verifies token and returns UsersDetails, throws on failed verification
     */
    verify(token: string): Promise<UserDetails>;
}

export interface UserDetails {
    userID: string;
    email: string;
    nickname: string;
    profileImg: string;
}

export interface IAuthProvider {
    /**
     * Verifies token and returns UsersDetails, throws on failed verification
     */
    verify(token: string): Promise<UserDetails>;
}

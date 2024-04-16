export interface UserDetails {
    email: string;
}

export interface IAuthProvider {
    verify(token: string): UserDetails;
}

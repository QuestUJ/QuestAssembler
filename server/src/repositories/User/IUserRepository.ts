import { User } from '@/domain/game/User';

export interface IUserRepository {
    createUser(): User;
    fetchUser(): User;
}

import { User } from '@/domain/game/User';

import { IUserRepository } from './IUserRepository';

export class UserRepositoryPostgres implements IUserRepository {
    createUser(): User {
        return new User();
    }

    fetchUser(): User {
        return new User();
    }
}

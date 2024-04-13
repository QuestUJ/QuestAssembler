import { Kysely } from 'kysely';

import { User } from '@/domain/game/User';
import { Database } from '@/infrastructure/postgres/db';

import { IUserRepository } from './IUserRepository';

export class UserRepositoryPostgres implements IUserRepository {
    constructor(db: Kysely<Database>) {
        db;
    }
    createUser(): User {
        return new User();
    }

    fetchUser(): User {
        return new User();
    }
}

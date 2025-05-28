import { User } from '../../../users/domain/entities/user.entity';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  saveUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  findUserByVerificationToken(token: string): Promise<User | null>;
}

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

import { UserRepository } from '../../domain/repositories/UserRepository';
import { DBUser } from '../../domain/aggregates/User';
import { Maybe } from '../../shared/types';
import { Result } from '../../shared/types/Result';
import { UserExistError, UserNotFoundError } from '../../domain/errors';
import { fail, ok } from '../../shared/utils';

export class InMemoryUserRepo implements UserRepository {
  private static readonly usersMap = new Map<string, DBUser>();

  async findAll(): Promise<DBUser[]> {
    return Array.from(InMemoryUserRepo.usersMap.values());
  }

  async findById(id: string): Promise<Maybe<DBUser>> {
    return InMemoryUserRepo.usersMap.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<Maybe<DBUser>> {
    return Array.from(InMemoryUserRepo.usersMap.values()).find((user) => user.email === email) ?? null;
  }

  async saveOne(user: DBUser): Promise<Result<void, UserExistError>> {
    if (InMemoryUserRepo.usersMap.has(user.id)) return fail(new UserExistError(user.email));
    InMemoryUserRepo.usersMap.set(user.id, user);
    return ok();
  }

  async updateOne(user: DBUser): Promise<Result<void, UserNotFoundError>> {
    if (!InMemoryUserRepo.usersMap.has(user.id)) return fail(new UserNotFoundError(user.id));
    InMemoryUserRepo.usersMap.set(user.id, user);
    return ok();
  }

  async deleteOne(id: string): Promise<void> {
    InMemoryUserRepo.usersMap.delete(id);
  }
}

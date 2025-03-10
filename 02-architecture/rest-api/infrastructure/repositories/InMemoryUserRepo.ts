import { UserRepository } from '../../domain/repositories/UserRepository';
import { DBUser } from '../../domain/aggregates/User';
import { Maybe } from '../../shared/types';
import { OkResult } from '../../shared/types/Result';
import { ok } from '../../shared/utils';

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

  // Для примера, можно возвращать fail, если в БД не получилось сохранить
  async saveOne(user: DBUser): Promise<OkResult> {
    InMemoryUserRepo.usersMap.set(user.id, user);
    return ok();
  }

  async updateOne(user: DBUser): Promise<OkResult> {
    InMemoryUserRepo.usersMap.set(user.id, user);
    return ok();
  }

  async deleteOne(id: string): Promise<void> {
    InMemoryUserRepo.usersMap.delete(id);
  }
}

import { DBUser } from '../aggregates/User';
import { Result } from '../../shared/types/Result';
import { UserExistError, UserNotFoundError } from '../errors';

export interface UserRepository {
  findAll(): Promise<DBUser[]>;
  findById(id: string): Promise<DBUser | null>;
  findByEmail(email: string): Promise<DBUser | null>;
  saveOne(user: DBUser): Promise<Result<void, UserExistError>>;
  deleteOne(id: string): Promise<void>;
  updateOne(user: DBUser): Promise<Result<void, UserNotFoundError>>;
}

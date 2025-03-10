import { DBUser } from '../aggregates/User';
import { OkResult } from '../../shared/types/Result';

export interface UserRepository {
  findAll(): Promise<DBUser[]>;
  findById(id: string): Promise<DBUser | null>;
  findByEmail(email: string): Promise<DBUser | null>;
  saveOne(user: DBUser): Promise<OkResult>;
  deleteOne(id: string): Promise<void>;
  updateOne(user: DBUser): Promise<OkResult>;
}

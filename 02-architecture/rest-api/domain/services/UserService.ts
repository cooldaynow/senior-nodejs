import { User } from '../aggregates/User';
import { UserExistError, UserNotFoundError } from '../errors';
import { UserRepository } from '../repositories/UserRepository';
import { unwrap } from '../../shared/utils';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  /* Получить всех пользователей */
  getUsers = async () => {
    const users = await this.userRepo.findAll();
    return users.map(User.createFromDB);
  };

  /* Получить одного пользователя по ID или ошибка */
  findOneByIdOrFail = async (id: string) => {
    const dbUser = await this.userRepo.findById(id);
    if (!dbUser) throw new UserNotFoundError(id);
    return User.createFromDB(dbUser);
  };

  /* Создать пользователя */
  createOne = async (payload: { email: User['email']; name?: User['name']; sex?: User['sex'] }) => {
    const { email } = payload;
    const isUserExist = await this.userRepo.findByEmail(email);
    if (isUserExist) throw new UserExistError(email);

    /* Сохраняем пользователя в БД, проверяем ошибки */
    const user = User.create(payload);
    unwrap(await this.userRepo.saveOne(user.toDBJSON()));
    return user;
  };

  /* Обновить публичные данные пользователя  */
  updateOnePublicData = async (payload: { id: User['id']; name: User['name']; sex: User['sex'] }) => {
    const { id, name, sex } = payload;
    const user = await this.findOneByIdOrFail(id);
    user.updatePublicFields({ name, sex });
    /* Обновляем пользователя в БД, проверяем ошибки */
    unwrap(await this.userRepo.updateOne(user.toDBJSON()));
    return user;
  };

  /* Удалить пользователя в БД */
  deleteOne = async (id: User['id']) => {
    const user = await this.findOneByIdOrFail(id);
    await this.userRepo.deleteOne(id);
    return user;
  };
}

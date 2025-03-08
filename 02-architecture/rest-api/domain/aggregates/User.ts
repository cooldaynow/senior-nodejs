import { randomUUID } from 'node:crypto';
import { PasswordObject, Password, DBPassword } from '../value-objects/Password';

type Sex = 'male' | 'female';
type UserCtorParams = { id?: string; email: string; name?: string; sex?: Sex; password?: Password };
type UserCreateParams = Pick<UserCtorParams, 'email' | 'name' | 'sex'>;
type UserCreateDBParams = Pick<UserCtorParams, 'email' | 'name' | 'sex'> & {
  id: string;
  password: PasswordObject;
};

export type DBUser = { id: string; email: string; name?: string; sex?: Sex; password: DBPassword };

export class User {
  public id: string;
  public email: string;
  public name?: string;
  public sex?: Sex;
  private password: Password;

  private constructor(params: UserCtorParams) {
    this.id = params.id ?? randomUUID();
    this.password = params.password ?? Password.create(randomUUID());
    this.email = params.email;
    this.name = params.name;
    this.sex = params.sex;
  }

  static create(params: UserCreateParams) {
    return new User(params);
  }

  /* Создать класс из данных БД */
  static createFromDB(params: UserCreateDBParams) {
    return new User({ ...params, password: Password.createFromDB(params.password) });
  }

  /* Обновить публичные поля пользователя */
  updatePublicFields(params: { name: User['name']; sex: User['sex'] }) {
    if (params.name) this.name = params.name;
    if (params.sex) this.sex = params.sex;
  }

  toJSON() {
    return { id: this.id, email: this.email, name: this.name, sex: this.sex };
  }

  /* Отдать пользователя в представлении БД */
  toDBJSON(): DBUser {
    return { ...this, password: this.password.toDBJSON() };
  }
}

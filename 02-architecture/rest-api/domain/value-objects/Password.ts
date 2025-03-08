import { createHmac, randomBytes } from 'node:crypto';

export type PasswordObject = { hash: string; salt: string; updatedAt: string };
export type DBPassword = PasswordObject;

export class Password {
  public hash: string;
  public salt: string;
  public updatedAt: string;

  private constructor(passwordObj: PasswordObject) {
    this.hash = passwordObj.hash;
    this.salt = passwordObj.salt;
    this.updatedAt = passwordObj.updatedAt;
  }

  /** Хеширование пароля */
  private static hashPassword(password: string, salt: string): string {
    return createHmac('sha256', salt).update(password).digest('hex');
  }

  /** Создать новый пароль */
  static create(plainPassword: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = Password.hashPassword(plainPassword, salt);
    return new Password({ hash, salt, updatedAt: new Date().toISOString() });
  }

  /** Восстановить пароль из БД */
  static createFromDB(passwordObj: DBPassword) {
    return new Password(passwordObj);
  }

  /** Проверить введённый пароль */
  verify(plainPassword: string): boolean {
    return Password.hashPassword(plainPassword, this.salt) === this.hash;
  }

  /** Обновить пароль */
  update(plainPassword: string) {
    this.salt = randomBytes(16).toString('hex');
    this.hash = Password.hashPassword(plainPassword, this.salt);
    this.updatedAt = new Date().toISOString();
  }

  /** Вернуть объект для сохранения в БД */
  toDBJSON(): PasswordObject {
    return { hash: this.hash, salt: this.salt, updatedAt: this.updatedAt };
  }
}

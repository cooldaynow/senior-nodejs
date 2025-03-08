import { APIError } from '../shared/errors';

export class UserNotFoundError extends APIError {
  constructor(id: string) {
    const message = `Пользователь с таким id (${id}) не найден`;
    super({ statusCode: 404, message });
  }
}

export class UserExistError extends APIError {
  constructor(email: string) {
    const message = `Пользователь с таким email (${email}) уже существует`;
    super({ statusCode: 409, message });
  }
}

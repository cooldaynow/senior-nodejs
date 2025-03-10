export type OkResult<T = void> = { ok: true; value?: T };
export type FailResult<E = Error> = { ok: false; error: E };
export type Result<T = void, E = Error> = OkResult<T> | FailResult<E>;

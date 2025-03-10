import { FailResult, OkResult, Result } from '../types/Result';

export function ok<T>(value?: T): OkResult<T> {
  return { ok: true, value };
}

export function fail<E>(error: E): FailResult<E> {
  return { ok: false, error };
}

export function unwrap<T, E>(result: Result<T, E>): T extends void ? void : T {
  if (!result.ok) throw result.error;
  return result.value as T extends void ? void : T;
}

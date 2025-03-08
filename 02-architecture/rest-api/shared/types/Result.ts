export type Result<T = void, E = Error> = { ok: true; value?: T } | { ok: false; error: E };

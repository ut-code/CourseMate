export type Response<T> = {
  code: number;
  ok: true;
  body: T;
} | {
  code: number;
  ok: false;
  body: string;
};


export function ok<T>(body: T): Response<T> {
  return {
    code: 200,
    ok: true,
    body,
  }
}

export function created<T>(body: T): Response<T> {
  return {
    code: 201,
    ok: true,
    body,
  }
}

export function unauthorized(text?: string): Response<never> {
  return {
    code: 401,
    ok: false,
    body: text ?? "auth error",
  }
}

export function forbidden(text?: string): Response<never> {
  return {
    code: 403,
    ok: false,
    body: text ?? "forbidden",
  }
}

export function notFound(text?: string): Response<never> {
  return {
    code: 404,
    ok: false,
    body: text ?? "not found",
  }
}

export function internalError(text?: string): Response<never> {
  return {
    code: 500,
    ok: false,
    body: text ?? "internal error",
  }
}

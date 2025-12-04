export interface ApiError {
  message: string;
  code?: string;
}

export interface ApiResult<R> {
  data: R | null;
  error?: ApiError;
}

/**
 * Converts object to ApiResult.
 * All api endpoints must return ApiResult.
 */
export function toResult<R>(data: R): ApiResult<R> {
  return { data };
}

export function toErrorResult<R = null>(message: string, code?: string): ApiResult<R> {
  return {
    data: null,
    error: { message, code },
  };
}

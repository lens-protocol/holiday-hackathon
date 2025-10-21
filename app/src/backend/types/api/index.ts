export type ApiResponse<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export const ok = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const err = <E>(error: E): ApiResponse<never, E> => ({
  success: false,
  error,
});

export interface AppError {
  type: 'ApplicationError' | 'ConnectionError' | 'LoginExpiredError';
  message?: string;
}

export function newError(type: AppError['type'], message?: string) {
  return { type, message };
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class AuthError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message)
    this.name = 'AuthError'
  }
}

export class SpreadsheetError extends Error {
  constructor(
    message: string,
    public spreadsheetId?: string,
    public range?: string
  ) {
    super(message)
    this.name = 'SpreadsheetError'
  }
}

export function isAPIError(error: unknown): error is APIError {
  return error instanceof APIError
}

export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error(String(error))
} 
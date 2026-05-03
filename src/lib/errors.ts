export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public name: string = "APP_ERROR",
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  constructor(message = "Already exists") {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, "UNAUTHORIZED_ERROR");
  }
}

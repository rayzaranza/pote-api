export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export class ConflictError extends AppError {
  constructor(message = "Already exists") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

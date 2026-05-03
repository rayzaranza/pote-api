export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
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
  }
}

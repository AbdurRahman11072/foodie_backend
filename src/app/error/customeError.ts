class customeError extends Error {
  private readonly statusCode: number;
  private readonly success: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = statusCode >= 400 ? false : true;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default customeError;

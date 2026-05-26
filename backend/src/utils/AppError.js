class AppError extends Error {

    constructor(
      message,
      statusCode,
      code = null
    ) {
  
      super(message);
  
      this.statusCode = statusCode;
  
      this.status =
        statusCode >= 500
          ? "error"
          : "fail";
  
      this.isOperational = true;
  
      this.code = code;
  
      Error.captureStackTrace(
        this,
        this.constructor
      );
    }
  }
  
  
  export const createError = {
  
    badRequest: (message, code = null) =>
      new AppError(
        message,
        400,
        code
      ),
  
    unauthorized: (
      message = "Authentication required"
    ) =>
      new AppError(
        message,
        401,
        "UNAUTHORIZED"
      ),
  
    forbidden: (
      message = "Access denied"
    ) =>
      new AppError(
        message,
        403,
        "FORBIDDEN"
      ),
  
    notFound: (
      resource = "Resource"
    ) =>
      new AppError(
        `${resource} not found`,
        404,
        "NOT_FOUND"
      ),
  
    conflict: (message, code = null) =>
      new AppError(
        message,
        409,
        code
      ),
  
    tooMany: (
      message = "Rate limit exceeded"
    ) =>
      new AppError(
        message,
        429,
        "RATE_LIMITED"
      ),
  
    internal: (
      message = "Something went wrong"
    ) =>
      new AppError(
        message,
        500,
        "INTERNAL_ERROR"
      ),
  };

export {AppError}
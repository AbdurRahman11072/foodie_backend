import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDev = process.env.NODE_ENV === 'dev';
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  if (error.code === 'P2002') {
    statusCode = httpStatus.CONFLICT;
    message = 'Already exist';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(isDev && {
      error: error,
      stackTrace: error.stack,
    }),
  });
};

export default globalErrorHandler;

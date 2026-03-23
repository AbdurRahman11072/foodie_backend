import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import customeError from '../error/customeError';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDev = process.env.NODE_ENV === 'dev';
  let statusCode = error.statusCode || 500;

  if (error.code === 'P2002') {
    throw new customeError(httpStatus.CONFLICT, 'Already exist');
  }

  res.status(statusCode).json({
    success: error.success,
    message: error.message,
    ...(isDev && {
      error: error,
      stackTrace: error.stack,
    }),
  });
};

export default globalErrorHandler;

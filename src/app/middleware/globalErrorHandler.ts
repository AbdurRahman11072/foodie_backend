import { NextFunction, Request, Response } from 'express';
import { envConfig } from '../config/envConfig';

const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDev = envConfig.NODE_ENV === 'dev';

  res.status(error.statusCode).json({
    success: error.success,
    message: error.message,
    ...(isDev && {
      error: error,
      stackTrace: error.stack,
    }),
  });
};

export default globalErrorHandler;

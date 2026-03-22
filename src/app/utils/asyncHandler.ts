import { NextFunction, Request, RequestHandler, Response } from 'express';

const asyncHandler = (requestHandler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

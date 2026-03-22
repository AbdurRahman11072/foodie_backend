import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { auth } from '../../lib/auth';
import customeResponse from '../utils/response';

const authMiddleware = (role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(role);
      const session = auth.api.getSession({
        headers: req.headers as any,
      });
      console.log(session);
    } catch (error) {
      customeResponse(httpStatus.FORBIDDEN, false, 'Unauthorized Access', null);
    }
  };
};

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { auth } from '../../lib/auth';
import customeError from '../error/customeError';

const authMiddleware = (role: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        throw new customeError(
          httpStatus.NOT_FOUND,
          'Unauthorized user. Please log in first'
        );
      }

      req.user = {
        id: session?.user?.id as string,
        name: session?.user?.name as string,
        email: session?.user?.email as string,
        role: session?.user?.role as 'user' | 'provider' | 'admin',
        banned: session?.user?.banned as boolean,
      };

      if (!role.includes(session?.user?.role as string)) {
        throw new customeError(httpStatus.FORBIDDEN, 'Unauthorized access');
      }

      next();
    } catch (error) {
      throw new customeError(httpStatus.FORBIDDEN, 'Unauthorized access');
    }
  };
};

export default authMiddleware;

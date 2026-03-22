import { Request, Response } from 'express';
import httpStatus from 'http-status';
import customeResponse from '../../utils/response';
import { userService } from './user.service';

const getAllUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUser();

    customeResponse(httpStatus.OK, true, 'Data found', result);
  } catch (error) {
    customeResponse(httpStatus.BAD_REQUEST, false, 'No user found', null);
  }
};

export const userController = {
  getAllUser,
};

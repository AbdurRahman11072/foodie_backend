import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { userService } from './user.service';

const getAllUser = asyncHandler(async (req, res) => {
  console.log();

  const result = await userService.getAllUser();

  if (result.length === 0) {
    throw new customeError(httpStatus.NOT_FOUND, 'No user available');
  }

  customeResponse(httpStatus.OK, true, 'Data found', result);
});
export const userController = {
  getAllUser,
};

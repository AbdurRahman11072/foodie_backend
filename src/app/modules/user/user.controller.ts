import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { userService } from './user.service';

const getAllUser = asyncHandler(async (req, res) => {
  console.log('getAll user Route hitting');

  const result = await userService.getAllUser();

  if (result.length === 0) {
    throw new customeError(httpStatus.NOT_FOUND, 'No user available');
  }
  console.log(result);

  customeResponse(res, httpStatus.OK, true, 'Data found', result);
});
export const userController = {
  getAllUser,
};

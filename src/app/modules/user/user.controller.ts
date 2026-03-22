import httpStatus from 'http-status';
import userRole from '../../constant';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { userService } from './user.service';

const getAllUser = asyncHandler(async (req, res) => {
  const result = await userService.getAllUser();

  if (result.length === 0) {
    throw new customeError(httpStatus.NOT_FOUND, 'No user available');
  }

  customeResponse(res, httpStatus.OK, true, 'Data found', result);
});

const updateUser = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  const isAdmin = req.user?.role === userRole.admin;
  const isOwner = req.user?.id === id;

  console.log(isAdmin, isOwner);

  if (!isAdmin && !isOwner) {
    throw new customeError(
      httpStatus.UNAUTHORIZED,
      'You do not have permission to update this user'
    );
  }
  const result = await userService.updateUser(id as string, data);
  customeResponse(
    res,
    httpStatus.OK,
    true,
    'User info updated successfully',
    result
  );
});

export const userController = {
  getAllUser,
  updateUser,
};

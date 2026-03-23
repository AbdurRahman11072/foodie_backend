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

// ??  * Updates a user's information with role-based permission checks.
// ?? * Only admins or the user themselves can update; role changes and banning actions are restricted to admins only.
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

  if (data.role === 'admin' && !isAdmin) {
    throw new customeError(
      httpStatus.UNAUTHORIZED,
      'Only administrators can update user roles'
    );
  }

  if (!isAdmin && data?.banned !== undefined) {
    throw new customeError(
      httpStatus.UNAUTHORIZED,
      'Only administrators can ban or unban users'
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

// ?? * Retrieves a user by ID with access control.
// ?? * Only the user themselves or an admin can view the user details.
const getUserById = asyncHandler(async (req, res) => {
  const ownerId = req.user?.id as string;
  const { id } = req.params;
  const isAdmin = req.user?.role === userRole.admin;
  const isOwner = ownerId === id;
  if (!isOwner && !isAdmin) {
    throw new customeError(
      httpStatus.FORBIDDEN,
      'Your not the onwer of the data you want to access. Please try a with vaild account'
    );
  }
  const result = await userService.getUserById(id as string);

  customeResponse(res, httpStatus.OK, true, 'User found', result);
});

export const userController = {
  getAllUser,
  updateUser,
  getUserById,
};

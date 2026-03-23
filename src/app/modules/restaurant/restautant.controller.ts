import httpStatus from 'http-status';
import userRole from '../../constant';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { restaurantSevices } from './restautant.service';

const createRestaurant = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = req.user?.id;
  const role = req.user?.id !== userRole.provider;
  const isUserVaild = user === data?.ownerId;
  if (!isUserVaild && !role) {
    throw new customeError(
      httpStatus.BAD_REQUEST,
      'Please try again with valid user'
    );
  }

  const result = await restaurantSevices.createRestaurant(data);

  customeResponse(
    res,
    httpStatus.CREATED,
    true,
    'Restaurant created successfully ',
    result
  );
});

export const restaurantController = {
  createRestaurant,
};

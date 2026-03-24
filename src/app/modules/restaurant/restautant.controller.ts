import httpStatus from 'http-status';
import userRole from '../../constant';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { restaurantSevices } from './restautant.service';

const getAllRestaurant = asyncHandler(async (req, res) => {
  const result = await restaurantSevices.getAllRestaurant();

  if (result.length === 0) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      'Not restaurant available in database'
    );
  }
  customeResponse(res, httpStatus.OK, true, 'All restaurant data', result);
});

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

const getRestaurantById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await restaurantSevices.getRestaurantById(id as string);

  if (result === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `Not restaurant with the ( id:${id} ) available in database`
    );
  }
  customeResponse(res, httpStatus.OK, true, 'All restaurant data', result);
});

const updateRestaurantInfo = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const data = req.body;
  const { id } = req.params;
  const isAdmin = userRole.admin === req.user?.role;
  const banned = data.banned !== undefined;

  if (data.ownerId !== undefined) {
    throw new customeError(
      httpStatus.FORBIDDEN,
      `You do not have permission to update this owner`
    );
  }

  if (!isAdmin && !banned) {
    throw new customeError(
      httpStatus.FORBIDDEN,
      `You do not have permission to banned this restaurant `
    );
  }
  const result = await restaurantSevices.updateRestaurantInfo(
    userId as string,
    id as string,
    data
  );
  customeResponse(
    res,
    httpStatus.OK,
    true,
    `Restaurant information updated successfully`,
    result
  );
});

export const restaurantController = {
  getAllRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurantInfo,
};

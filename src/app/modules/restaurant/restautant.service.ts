import httpStatus from 'http-status';
import { restaurants } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import userRole from '../../constant';
import customeError from '../../error/customeError';

const getAllRestaurant = async () => {
  return await prisma.restaurants.findMany();
};

const createRestaurant = async (data: restaurants) => {
  const isRestaurantExist = await prisma.restaurants.findFirst({
    where: { ownerId: data.ownerId },
  });

  if (isRestaurantExist) {
    throw new customeError(
      httpStatus.BAD_REQUEST,
      `Restaurant already exist. You can't create new restaurant with this account`
    );
  }

  const restaurantCreated = await prisma.restaurants.create({
    data: data,
  });

  if (!restaurantCreated) {
    throw new customeError(
      httpStatus.BAD_REQUEST,
      `Failed to create restaurant`
    );
  }
  const updateUserRole = await prisma.user.update({
    where: { id: data.ownerId },
    data: {
      role: userRole.provider,
    },
  });

  return restaurantCreated;
};

const getRestaurantById = async (id: string) => {
  return await prisma.restaurants.findFirst({
    where: { id },
  });
};

const updateRestaurantInfo = async (
  userId: string,
  id: string,
  data: Partial<restaurants>
) => {
  const isRestaurantOwner = await prisma.restaurants.findFirst({
    where: {
      id: id,
      ownerId: userId,
    },
  });

  if (isRestaurantOwner === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `The information of the restaurant you wnat to update doesn't exist. `
    );
  }
  return await prisma.restaurants.update({
    where: {
      id: id,
      ownerId: userId,
    },
    data: data,
  });
};

export const restaurantSevices = {
  getAllRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurantInfo,
};

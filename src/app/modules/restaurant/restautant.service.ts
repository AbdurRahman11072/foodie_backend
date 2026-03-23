import httpStatus from 'http-status';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { restaurants } from './../../generated/prisma/client';

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

  return await prisma.restaurants.create({
    data: data,
  });
};

export const restaurantSevices = {
  createRestaurant,
};

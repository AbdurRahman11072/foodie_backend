import httpStatus from 'http-status';
import { restaurants } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import userRole from '../../constant';
import customeError from '../../error/customeError';

const getAllRestaurant = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const data = await prisma.restaurants.findMany({
    skip,
    take,
    include: {
      _count: {
        select: {
          meals: true, // Count of meals
          orderItem: true, // Count of order items
        },
      },
    },
  });

  const total = await prisma.restaurants.count();

  return { data, total };
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
      restaurantId: restaurantCreated.id,
    },
  });

  return restaurantCreated;
};

const getRestaurantById = async (id: string) => {
  return await prisma.restaurants.findFirst({
    where: { id },
    include: {
      meals: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          rating: true,
          coverImg: true,
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      reviews: {
        take: 10,
        select: {
          userName: true,
          rating: true,
          description: true,
          updatedAt: true,
        },
      },
    },
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
const featuredRestaurant = async () => {
  // First, get meals from restaurants with rating > 4
  const meals = await prisma.restaurants.findMany({
    where: {
      rating: {
        gt: 4, // rating greater than 4
      },
    },
  });

  // Randomly select 10 meals (or fewer if not enough meals exist)
  const shuffled = meals.sort(() => 0.5 - Math.random());
  const randomMeals = shuffled.slice(0, 10);

  return randomMeals;
};

export const restaurantSevices = {
  getAllRestaurant,
  createRestaurant,
  getRestaurantById,
  updateRestaurantInfo,
  featuredRestaurant,
};

import httpStatus from 'http-status';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { meals } from '../../generated/prisma/client';

const getAllMeals = async () => {
  return await prisma.meals.findMany();
};

const createMeals = async (id: string, data: meals) => {
  const isValidUser = await prisma.user.findFirst({
    where: { id },
    select: {
      restaurant: true,
    },
  });

  if (isValidUser?.restaurant === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `Restaurant not found. Please create a restaurant then try again`
    );
  }

  if (isValidUser?.restaurant.id !== data.restaurantId) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `Only restaurant owner can add meals`
    );
  }

  return await prisma.meals.create({
    data: data,
  });
};

const getMealsById = async (id: string) => {
  return await prisma.meals.findFirst({
    where: { id },
  });
};

const updateMealsInfo = async (
  userId: string,
  id: string,
  data: Partial<meals>
) => {
  const restaurantId = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      restaurant: true,
    },
  });
  const ismealsOwner = await prisma.meals.findFirst({
    where: {
      id: id,
      restaurantId: restaurantId?.restaurant?.id as string,
    },
  });

  if (ismealsOwner === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `Only owner can update meals details. `
    );
  }
  return await prisma.meals.update({
    where: {
      id: id,
      restaurantId: restaurantId?.restaurant?.id as string,
    },
    data: data,
  });
};

export const mealsServices = {
  getAllMeals,
  createMeals,
  getMealsById,
  updateMealsInfo,
};

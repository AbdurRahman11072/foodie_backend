import httpStatus from 'http-status';
import { mealsWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { MealData } from '../../types/mealData';

const getAllMeals = async ({
  search,
  categoryTags,
  price,
  page,
  limit,
}: {
  search: string | undefined;
  categoryTags: string[] | [];
  price: number | undefined;
  page: number | 1;
  limit: number | 2;
}) => {
  const andConditions: mealsWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    });
  }

  if (categoryTags && categoryTags.length > 0) {
    andConditions.push({
      categories: {
        some: {
          name: {
            in: categoryTags,
            mode: 'insensitive',
          },
        },
      },
    });
  }
  if (price) {
    andConditions.push({
      price: {
        lte: price,
      },
    });
  }

  const skip = (page - 1) * limit;
  const take = limit;

  const data = await prisma.meals.findMany({
    skip: skip,
    take: take,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      AND: andConditions,
    },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const totalMeal = await prisma.meals.count();
  return { data, totalMeal };
};

const createMeals = async (id: string, mealData: MealData) => {
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

  if (isValidUser?.restaurant.id !== mealData.restaurantId) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `Only restaurant owner can add meals`
    );
  }

  return await prisma.meals.create({
    data: {
      name: mealData?.name,
      restaurantId: mealData.restaurantId,
      coverImg: mealData.coverImg,
      description: mealData.description,
      price: mealData.price,
      rating: mealData.rating || 0,
      available: mealData.available,
      ingredients: mealData.ingredients,
      calories: mealData.calories,
      servingSize: mealData.servingSize,
      status: 'PUBLISHED',
      categories: {
        connect: mealData?.categories?.map((categoryId: string) => ({
          id: categoryId,
        })),
      },
    },
  });
};

const getMealsById = async (id: string) => {
  return await prisma.meals.findFirst({
    where: { id },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
      restaurant: {
        select: {
          id: true,
          name: true,
          coverImg: true,
          rating: true,
          openingTime: true,
          closingTime: true,
        },
      },
    },
  });
};

const getMealsByRestaurantId = async (id: string) => {
  return await prisma.meals.findMany({
    where: { restaurantId: id },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const updateMealsInfo = async (
  restaurantId: string,
  id: string,
  data: Partial<MealData>
) => {
  // Check if the meal exists and belongs to the restaurant owner
  const isMealOwner = await prisma.meals.findFirst({
    where: {
      id: id,
      restaurantId: restaurantId as string,
    },
  });

  if (isMealOwner === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `Only owner can update meals details.`
    );
  }

  // Prepare the update data object
  const updateData: any = {};

  // Only include fields that are provided
  if (data.name !== undefined) updateData.name = data.name;
  if (data.coverImg !== undefined) updateData.coverImg = data.coverImg;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.available !== undefined) updateData.available = data.available;
  if (data.ingredients !== undefined) updateData.ingredients = data.ingredients;
  if (data.calories !== undefined) updateData.calories = data.calories;
  if (data.servingSize !== undefined) updateData.servingSize = data.servingSize;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.rating !== undefined) updateData.rating = data.rating;

  // Handle categories - similar to createMeals but with 'set' instead of 'connect'
  if (data.categories !== undefined) {
    updateData.categories = data.categories;
  }

  return await prisma.meals.update({
    where: {
      id: id,
      restaurantId: restaurantId as string,
    },
    data: updateData,
  });
};

export const mealsServices = {
  getAllMeals,
  createMeals,
  getMealsById,
  updateMealsInfo,
  getMealsByRestaurantId,
};

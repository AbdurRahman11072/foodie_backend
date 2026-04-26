import { reviews } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';

const getAllReviews = async () => {
  return await prisma.reviews.findMany();
};

const createReviews = async (data: reviews) => {
  const isReviewExist = await prisma.reviews.findFirst({
    where: {
      restaurantId: data.restaurantId,
      userId: data.userId,
      mealId: data.mealId,
    },
  });
  return await prisma.reviews.create({
    data: data,
  });
};

const updateReviews = async (id: string, data: Partial<reviews>) => {
  return await prisma.reviews.update({
    where: { id },
    data: data,
  });
};

const deleteReviews = async (id: string) => {
  return await prisma.reviews.delete({
    where: { id },
  });
};
export const reviewsService = {
  getAllReviews,
  createReviews,
  updateReviews,
  deleteReviews,
};

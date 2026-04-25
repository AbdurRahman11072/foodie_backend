import { prisma } from '../../../lib/prisma';
import userRole from '../../constant';

const getAllStats = async (restaurantId: string, role: string) => {
  if (role === userRole.provider) {
    const stats = await prisma.$transaction(async (tx) => {
      const mealCount = await tx.meals.count({
        where: {
          restaurantId,
        },
      });
      const orderItemCount = await tx.orderItems.count({
        where: {
          restaurantId,
        },
      });
      const orderItmeTotalEarning = await tx.orderItems.aggregate({
        where: {
          restaurantId,
          status: 'DELIVERED',
        },
        _sum: {
          totalPrice: true,
        },
      });

      return {
        totalMeal: mealCount,
        totalOrder: orderItemCount,
        totalEarning: orderItmeTotalEarning._sum.totalPrice,
      };
    });
    return stats;
  }

  const stats = await prisma.$transaction(async (tx) => {
    const totalUser = await tx.user.count();
    const activeUser = await tx.user.count({
      where: {
        banned: false,
      },
    });
    const orderItemCount = await tx.orderItems.count();
    const orderItmeTotalEarning = await tx.orderItems.aggregate({
      _sum: {
        totalPrice: true,
      },
    });

    return {
      totalUser: totalUser,
      activeUser: activeUser,
      totalOrder: orderItemCount,
      totalEarning: orderItmeTotalEarning._sum.totalPrice,
    };
  });
  return stats;
};

export const statsService = {
  getAllStats,
};

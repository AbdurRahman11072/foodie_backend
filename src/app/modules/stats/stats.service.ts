import { prisma } from '../../../lib/prisma';
import userRole from '../../constant';

const getAllStats = async (restaurantId: string, role: string) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  if (role === userRole.provider) {
    const stats = await prisma.$transaction(async (tx) => {
      const mealCount = await tx.meals.count({
        where: { restaurantId },
      });
      const orderItemCount = await tx.orderItems.count({
        where: { restaurantId },
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

      // Daily revenue for the last 7 days
      const last7DaysOrders = await tx.orderItems.findMany({
        where: {
          restaurantId,
          status: 'DELIVERED',
          createdAt: { gte: sevenDaysAgo },
        },
        select: {
          createdAt: true,
          totalPrice: true,
        },
      });

      // Top 5 meals
      const topMealsData = await tx.orderItems.groupBy({
        by: ['mealId', 'mealName'],
        where: { restaurantId },
        _count: { mealId: true },
        orderBy: {
          _count: { mealId: 'desc' },
        },
        take: 5,
      });

      // Order status distribution
      const orderStatusDistribution = await tx.orderItems.groupBy({
        by: ['status'],
        where: { restaurantId },
        _count: { status: true },
      });

      return {
        totalMeal: mealCount,
        totalOrder: orderItemCount,
        totalEarning: orderItmeTotalEarning._sum.totalPrice || 0,
        revenueData: last7DaysOrders,
        topMeals: topMealsData,
        orderStatusDistribution,
      };
    });
    return stats;
  }

  const stats = await prisma.$transaction(async (tx) => {
    const totalUser = await tx.user.count();
    const activeUser = await tx.user.count({
      where: { banned: false },
    });
    const orderItemCount = await tx.orderItems.count();
    const orderItmeTotalEarning = await tx.orderItems.aggregate({
      _sum: { totalPrice: true },
    });

    // Daily revenue for the last 7 days (Platform wide)
    const last7DaysOrders = await tx.orderItems.findMany({
      where: {
        status: 'DELIVERED',
        createdAt: { gte: sevenDaysAgo },
      },
      select: {
        createdAt: true,
        totalPrice: true,
      },
    });

    // Top 5 meals (Platform wide)
    const topMealsData = await tx.orderItems.groupBy({
      by: ['mealId', 'mealName'],
      _count: { mealId: true },
      orderBy: {
        _count: { mealId: 'desc' },
      },
      take: 5,
    });

    // Order status distribution (Platform wide)
    const orderStatusDistribution = await tx.orderItems.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      totalUser: totalUser,
      activeUser: activeUser,
      totalOrder: orderItemCount,
      totalEarning: orderItmeTotalEarning._sum.totalPrice || 0,
      revenueData: last7DaysOrders,
      topMeals: topMealsData,
      orderStatusDistribution,
    };
  });
  return stats;
};

export const statsService = {
  getAllStats,
};

import { prisma } from "../../../lib/prisma";
import userRole from "../../constant";

const getAllStats = async (restaurantId: string, role: string) => {
  // Fix: Proper date calculation for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  if (role === userRole.provider) {
    const stats = await prisma.$transaction(async (tx) => {
      const mealCount = await tx.meals.count({
        where: { restaurantId },
      });
      const orderItemCount = await tx.orderItems.count({
        where: { restaurantId },
      });
      const orderItemTotalEarning = await tx.orderItems.aggregate({
        where: {
          restaurantId,
          status: "DELIVERED",
        },
        _sum: {
          totalPrice: true,
        },
      });

      // Daily revenue for the last 7 days
      const last7DaysOrders = await tx.orderItems.findMany({
        where: {
          restaurantId,
          status: "DELIVERED",
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          createdAt: true,
          totalPrice: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Top 5 meals
      const topMealsData = await tx.orderItems.groupBy({
        by: ["mealId", "mealName"],
        where: { restaurantId },
        _count: { mealId: true },
        orderBy: {
          _count: { mealId: "desc" },
        },
        take: 5,
      });

      // Order status distribution
      const orderStatusDistribution = await tx.orderItems.groupBy({
        by: ["status"],
        where: { restaurantId },
        _count: { status: true },
      });

      // Process revenue data to group by date - convert to ISO strings
      const revenueData = processRevenueByDate(last7DaysOrders, sevenDaysAgo);

      return {
        totalMeal: mealCount,
        totalOrder: orderItemCount,
        totalEarning: orderItemTotalEarning._sum.totalPrice || 0,
        revenueData,
        topMeals: topMealsData,
        orderStatusDistribution,
      };
    });
    return stats;
  }

  if (role === userRole.admin) {
    const stats = await prisma.$transaction(async (tx) => {
      const totalUser = await tx.user.count();
      const activeUser = await tx.user.count({
        where: { banned: false },
      });
      const totalRestaurant = await tx.restaurants.count();
      const orderItemCount = await tx.orderItems.count();
      const orderItemTotalEarning = await tx.orderItems.aggregate({
        where: {
          status: "DELIVERED",
        },
        _sum: { totalPrice: true },
      });

      // Daily revenue for the last 7 days (Platform wide)
      const last7DaysOrders = await tx.orderItems.findMany({
        where: {
          status: "DELIVERED",
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
        select: {
          createdAt: true,
          totalPrice: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Top 5 meals (Platform wide)
      const topMealsData = await tx.orderItems.groupBy({
        by: ["mealId", "mealName"],
        _count: { mealId: true },
        orderBy: {
          _count: { mealId: "desc" },
        },
        take: 5,
      });

      // Order status distribution (Platform wide)
      const orderStatusDistribution = await tx.orderItems.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      // Process revenue data to group by date - convert to ISO strings
      const revenueData = processRevenueByDate(last7DaysOrders, sevenDaysAgo);

      return {
        totalUser,
        activeUser,
        totalRestaurant,
        totalOrder: orderItemCount,
        totalEarning: orderItemTotalEarning._sum.totalPrice || 0,
        revenueData,
        topMeals: topMealsData,
        orderStatusDistribution,
      };
    });
    return stats;
  }

  throw new Error("Invalid role");
};

// Helper function to process and group revenue by date
const processRevenueByDate = (orders: any[], startDate: Date) => {
  // Create a map for the last 7 days with 0 revenue
  const revenueMap = new Map();

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    // Use local date string format
    const dateKey = date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
    revenueMap.set(dateKey, 0);
  }

  // Sum up the revenue for each day
  orders.forEach((order) => {
    // Convert Prisma date to JavaScript Date safely
    const orderDate = new Date(order.createdAt);
    if (!isNaN(orderDate.getTime())) {
      const dateKey = orderDate.toLocaleDateString("en-CA");
      if (revenueMap.has(dateKey)) {
        revenueMap.set(
          dateKey,
          revenueMap.get(dateKey) + (order.totalPrice || 0),
        );
      }
    }
  });

  // Convert map to array format suitable for charts
  return Array.from(revenueMap, ([date, revenue]) => ({
    date,
    revenue: Number(revenue.toFixed(2)), // Ensure proper number format
  }));
};

export const statsService = {
  getAllStats,
};

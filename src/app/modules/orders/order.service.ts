import httpStatus from 'http-status';
import { orders } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { CreateOrderInput } from '../../types/orderData';

const getAllOrders = async () => {
  return await prisma.orders.findMany({
    include: {
      items: true,
    },
  });
};

const getOrderByUserId = async (userId: string) => {
  const order = await prisma.orders.findMany({
    where: { userId },
    include: {
      items: true,
    },
  });

  if (order === null) {
    throw new customeError(httpStatus.NOT_FOUND, `Can't find this order`);
  }
  return order;
};
const getOrderById = async (id: string) => {
  console.log(id);

  const order = await prisma.orders.findFirst({
    where: { id },
    include: {
      items: true,
    },
  });

  console.log(order);

  return order;
};

const createOrder = async (data: CreateOrderInput) => {
  const {
    userId,
    orderId,
    address,
    phoneNumber,
    totalPrice,
    status,
    paymentMethod,
    items,
  } = data;

  const newOrder = await prisma.orders.create({
    data: {
      orderId: orderId,
      userId: userId,
      address: address,
      phoneNumber: phoneNumber,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      items: {
        create: items.map((item) => ({
          restaurantId: item.restaurantId,
          restaurantName: item.restaurantName,
          mealId: item.mealId,
          mealName: item.mealName,
          mealImg: item.mealImg,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice,
          status: item.status || 'PREPARING',
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return newOrder;
};

const updateOrder = async (id: string, data: Partial<orders>) => {
  return await prisma.orders.update({
    where: { id },
    data: data,
  });
};

export const orderService = {
  getAllOrders,
  createOrder,
  updateOrder,
  getOrderByUserId,
  getOrderById,
};

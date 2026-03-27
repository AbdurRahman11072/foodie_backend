import httpStatus from 'http-status';
import { orders } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';

const getAllOrders = async () => {
  return await prisma.orders.findMany();
};

const getOrderById = async (id: string) => {
  const order = await prisma.orders.findFirst({
    where: { id },
  });

  if (order === null) {
    throw new customeError(httpStatus.NOT_FOUND, `Can't find this order`);
  }
  return order;
};

const createOrder = async (data: orders) => {
  return await prisma.orders.create({
    data: data,
  });
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
  getOrderById,
};

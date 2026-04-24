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

const cancelOrder = async (id: string) => {
  //check if order exist
  const order = await prisma.orders.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new customeError(httpStatus.NOT_FOUND, 'Order not found. ');
  }

  const cancellableStatuses = ['PENDING', 'PREPARING'];
  // check if order is cancellable
  if (!cancellableStatuses.includes(order.status)) {
    throw new customeError(
      httpStatus.BAD_REQUEST,
      `Order cannot be cancelled because it is ${order.status.toLowerCase()}`
    );
  }

  // cancelOrder
  const cancelOrder = await prisma.$transaction(async (tx) => {
    const updateItems = await tx.orderItems.updateMany({
      where: {
        orderId: id,
        status: { not: 'CANCELLED' },
      },
      data: {
        status: 'CANCELLED',
      },
    });

    const updateOrder = await tx.orders.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
      include: {
        items: true,
      },
    });
    return {
      order: updateOrder,
      itemsCancelled: updateItems.count,
    };
  });

  return cancelOrder;
};

const UpdateOrderItems = async (id: string, data: any) => {
  const isOrderItemExsist = await prisma.orderItems.findFirst({
    where: {
      id,
    },
  });
  if (!isOrderItemExsist) {
    throw new customeError(httpStatus.NOT_FOUND, 'Order item not found');
  }

  console.log('order: ', data);

  return await prisma.orderItems.update({
    where: {
      id,
    },
    data,
  });
};
export const orderService = {
  getAllOrders,
  createOrder,
  updateOrder,
  getOrderByUserId,
  getOrderById,
  cancelOrder,
  UpdateOrderItems,
};

import httpStatus from 'http-status';
import { orders } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { CreateOrderInput, orderItemStatus } from '../../types/orderData';

const getAllOrders = async () => {
  return await prisma.orders.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      items: true,
    },
  });
};

const getOrderByUserId = async (userId: string) => {
  const order = await prisma.orders.findMany({
    orderBy: {
      updatedAt: 'desc',
    },

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

const getAllOrderItem = async () => {
  return await prisma.orderItems.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      order: true,
    },
  });
};

const getOrderItemsByRestaurantId = async (restaurantId: string) => {
  const order = await prisma.orderItems.findMany({
    orderBy: {
      updatedAt: 'desc',
    },

    where: { restaurantId },
  });

  if (order === null) {
    throw new customeError(httpStatus.NOT_FOUND, `No order availvable`);
  }
  return order;
};

const getOrderById = async (id: string) => {
  const order = await prisma.orders.findFirst({
    where: { id },
    include: {
      items: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

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
          status: item.status || 'PENDING',
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

const cancelOrderItems = async (id: string) => {
  // Check if order item exists
  const isOrderItemExsist = await prisma.orderItems.findFirst({
    where: {
      id,
    },
  });

  if (!isOrderItemExsist) {
    throw new customeError(httpStatus.NOT_FOUND, 'Order item not found');
  }

  const cancellableStatuses = ['PENDING', 'PREPARING'];

  // Check if the specific item can be cancelled
  if (!cancellableStatuses.includes(isOrderItemExsist.status)) {
    throw new customeError(
      httpStatus.BAD_REQUEST,
      `Order item cannot be cancelled because it is already ${isOrderItemExsist.status}`
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Cancel the order item
    const orderItemCancel = await tx.orderItems.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
      },
    });

    // Get the parent order with all items
    const order = await tx.orders.findUnique({
      where: {
        id: orderItemCancel.orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Check if all items are cancelled
    const allItemsCancelled =
      order.items.length > 0 &&
      order.items.every((item) => item.status === 'CANCELLED');

    // Update order status if all items are cancelled
    if (allItemsCancelled && order.status !== 'CANCELLED') {
      // Check if the order can be cancelled
      if (!cancellableStatuses.includes(order.status)) {
        throw new customeError(
          httpStatus.BAD_REQUEST,
          `Order cannot be cancelled because it is ${order.status.toLowerCase()}`
        );
      }

      // Update the order status
      const updateOrderStatus = await tx.orders.update({
        where: {
          id: orderItemCancel.orderId,
        },
        data: {
          status: 'CANCELLED',
        },
      });

      if (!updateOrderStatus) {
        throw new customeError(
          httpStatus.BAD_REQUEST,
          'Failed to update order status'
        );
      }

      // Return both the cancelled item and updated order
      return {
        cancelledItem: orderItemCancel,
        order: updateOrderStatus,
        allItemsCancelled: true,
      };
    }

    // If not all items are cancelled, just return the cancelled item
    return {
      cancelledItem: orderItemCancel,
      allItemsCancelled: false,
    };
  });

  return result;
};

const updateOrderItmeStatus = async (id: string, data: orderItemStatus) => {
  const isOrderItemExist = await prisma.orderItems.findUnique({
    where: {
      id,
    },
  });
  if (!isOrderItemExist) {
    throw new customeError(httpStatus.NOT_FOUND, 'Order Item not found. ');
  }
  const updatedItem = await prisma.orderItems.update({
    where: { id },
    data: {
      status: data.status,
    },
  });

  if (!updatedItem) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      'Order Item not found. Please try to change  another item status'
    );
  }

  return updatedItem;
};
export const orderService = {
  getAllOrders,
  createOrder,
  updateOrder,
  getOrderByUserId,
  getOrderItemsByRestaurantId,
  getOrderById,
  cancelOrder,
  cancelOrderItems,
  updateOrderItmeStatus,
  getAllOrderItem,
};

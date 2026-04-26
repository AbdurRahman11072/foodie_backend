import httpStatus from 'http-status';
import { orders } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { CreateOrderInput, OrderItemStatusType } from '../../types/orderData';
import {
  OrderStatusType,
  determineOrderStatusFromItems,
  isTerminalOrderStatus,
} from '../../utils/orderStatusHelper';

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
      items: {
        select: {
          id: true,
          orderId: true,
          restaurantId: true,
          restaurantName: true,
          mealId: true,
          mealName: true,
          mealImg: true,
          quantity: true,
          price: true,
          totalPrice: true,
          status: true,
          meal: {
            select: {
              reviews: {
                where: {
                  userId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
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

// old cancelOrderitems

const cancelOrderItems = async (id: string) => {
  // Check if order item exists
  const isOrderItemExsist = await prisma.orderItems.findFirst({
    where: { id },
  });

  if (!isOrderItemExsist) {
    throw new customeError(httpStatus.NOT_FOUND, 'Order item not found');
  }

  const cancellableStatuses = ['PENDING', 'PREPARING'];

  if (!cancellableStatuses.includes(isOrderItemExsist.status)) {
    throw new customeError(
      httpStatus.BAD_REQUEST,
      `Order item cannot be cancelled because it is already ${isOrderItemExsist.status}`
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // Cancel the order item
    const orderItemCancel = await tx.orderItems.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Get the parent order with all items - TypeScript knows this includes items
    const order = await tx.orders.findUnique({
      where: { id: orderItemCancel.orderId },
      include: { items: true },
    });

    if (!order) {
      throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Now TypeScript knows order has items property
    const allItemsCancelled = order.items.every(
      (item) => item.status === 'CANCELLED'
    );

    // Check if all remaining items are delivered
    const remainingItems = order.items.filter(
      (item) => item.status !== 'CANCELLED'
    );

    const allRemainingItemsDelivered =
      remainingItems.length > 0 &&
      remainingItems.every((item) => item.status === 'DELIVERED');

    // If all items are cancelled
    if (allItemsCancelled && order.status !== 'CANCELLED') {
      if (!cancellableStatuses.includes(order.status)) {
        throw new customeError(
          httpStatus.BAD_REQUEST,
          `Order cannot be cancelled because it is ${order.status.toLowerCase()}`
        );
      }

      const updatedOrder = await tx.orders.update({
        where: { id: orderItemCancel.orderId },
        data: { status: 'CANCELLED' },
      });

      return {
        cancelledItem: orderItemCancel,
        order: updatedOrder,
        allItemsCancelled: true,
      };
    }

    // If all remaining items are delivered, mark order as COMPLETE
    if (allRemainingItemsDelivered && order.status !== 'COMPLETE') {
      const updatedOrder = await tx.orders.update({
        where: { id: orderItemCancel.orderId },
        data: { status: 'COMPLETE' },
      });

      return {
        cancelledItem: orderItemCancel,
        order: updatedOrder,
        allItemsCancelled: false,
        orderCompleted: true,
      };
    }

    // If not all items are cancelled or delivered, just return the cancelled item
    return {
      cancelledItem: orderItemCancel,
      allItemsCancelled: false,
    };
  });

  return result;
};

// old updateOrderItemStatus

// const updateOrderItmeStatus = async (id: string, data: orderItemStatus) => {
//   const isOrderItemExist = await prisma.orderItems.findUnique({
//     where: { id },
//   });

//   if (!isOrderItemExist) {
//     throw new customeError(httpStatus.NOT_FOUND, 'Order Item not found.');
//   }

//   const result = await prisma.$transaction(async (tx) => {
//     // Update the order item status
//     const updatedItem = await tx.orderItems.update({
//       where: { id },
//       data: {
//         status: data.status,
//       },
//     });

//     if (!updatedItem) {
//       throw new customeError(
//         httpStatus.NOT_FOUND,
//         'Order Item not found. Please try to change another item status'
//       );
//     }

//     // Get the parent order with all items
//     const order = await tx.orders.findUnique({
//       where: {
//         id: updatedItem.orderId,
//       },
//       include: {
//         items: true,
//       },
//     });

//     if (!order) {
//       throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
//     }

//     // Check if all items are delivered
//     const allItemsDelivered = order.items.every(
//       (item) => item.status === 'DELIVERED'
//     );

//     // If all items are delivered, mark order as COMPLETE
//     if (allItemsDelivered && order.status !== 'COMPLETE') {
//       await tx.orders.update({
//         where: {
//           id: order.id,
//         },
//         data: {
//           status: 'COMPLETE',
//         },
//       });
//     }

//     return updatedItem;
//   });

//   return result;
// };

// const updateOrderItemStatus = async (id: string, data: orderItemStatus) => {
//   const isOrderItemExist = await prisma.orderItems.findUnique({
//     where: { id },
//   });

//   if (!isOrderItemExist) {
//     throw new customeError(httpStatus.NOT_FOUND, 'Order Item not found.');
//   }

//   const result = await prisma.$transaction(async (tx) => {
//     // Update the order item status
//     const updatedItem = await tx.orderItems.update({
//       where: { id },
//       data: {
//         status: data.status,
//       },
//     });

//     if (!updatedItem) {
//       throw new customeError(
//         httpStatus.NOT_FOUND,
//         'Order Item not found. Please try to change another item status'
//       );
//     }

//     // Get the parent order with all items
//     const order = await tx.orders.findUnique({
//       where: {
//         id: updatedItem.orderId,
//       },
//       include: {
//         items: true,
//       },
//     });

//     if (!order) {
//       throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
//     }

//     // Skip status update for terminal states
//     if (order.status === 'CANCELLED' || order.status === 'COMPLETE') {
//       return updatedItem;
//     }

//     const itemStatuses = order.items.map(item => item.status);

//     // Determine new order status based on all item statuses
//     let newOrderStatus:   = null;

//     // 1. Check if all items are CANCELLED
//     if (itemStatuses.every(status => status === 'CANCELLED')) {
//       newOrderStatus = 'CANCELLED';
//     }
//     // 2. Check if all items are DELIVERED
//     else if (itemStatuses.every(status => status === 'DELIVERED')) {
//       newOrderStatus = 'COMPLETE';
//     }
//     // 3. Check if all items are READY
//     else if (itemStatuses.every(status => status === 'READY')) {
//       newOrderStatus = 'DELIVERING';
//     }
//     // 4. Check if any item is DELIVERED or READY (partial delivery)
//     else if (itemStatuses.some(status =>
//       status === 'DELIVERED' || status === 'READY'
//     )) {
//       newOrderStatus = 'DELIVERING';
//     }
//     // 5. Check if any item is PREPARING
//     else if (itemStatuses.some(status => status === 'PREPARING')) {
//       newOrderStatus = 'PREPARING';
//     }
//     // 6. Check if any item has progressed beyond PENDING
//     else if (itemStatuses.some(status => status !== 'PENDING')) {
//       newOrderStatus = 'PREPARING';
//     }
//     // 7. Default to PENDING
//     else {
//       newOrderStatus = 'PENDING';
//     }

//     // Update order status if changed
//     if (newOrderStatus && order.status !== newOrderStatus) {
//       await tx.orders.update({
//         where: {
//           id: order.id,
//         },
//         data: {
//           status: newOrderStatus,
//           updatedAt: new Date(),
//         },
//       });
//     }

//     return updatedItem;
//   });

//   return result;
// };

// services/orderService.ts

// // new cancelOrderitems
// const cancelOrderItems = async (id: string) => {
//   // Check if order item exists
//   const existingOrderItem = await prisma.orderItems.findFirst({
//     where: { id },
//   });

//   if (!existingOrderItem) {
//     throw new customeError(httpStatus.NOT_FOUND, 'Order item not found');
//   }

//   // Use the SAME helper function to check if item can be cancelled
//   if (!canCancelItem(existingOrderItem.status as OrderItemStatusType)) {
//     throw new customeError(
//       httpStatus.BAD_REQUEST,
//       `Order item cannot be cancelled because it is already ${existingOrderItem.status}`
//     );
//   }

//   const result = await prisma.$transaction(async (tx) => {
//     // Cancel the order item
//     const cancelledItem = await tx.orderItems.update({
//       where: { id },
//       data: {
//         status: 'CANCELLED',
//         updatedAt: new Date(),
//       },
//     });

//     // Get the parent order with all items
//     const order = await tx.orders.findUnique({
//       where: { id: cancelledItem.orderId },
//       include: { items: true },
//     });

//     if (!order) {
//       throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
//     }

//     // Skip if order is already in terminal state
//     if (isTerminalOrderStatus(order.status as OrderStatusType)) {
//       return {
//         success: true,
//         cancelledItem,
//         order,
//         message: `Order is already ${order.status.toLowerCase()}. Item cancelled but order status unchanged.`,
//       };
//     }

//     // Get all item statuses after cancellation
//     const itemStatuses = order.items.map(
//       (item) => item.status as OrderItemStatusType
//     );

//     // Use the SAME helper function to determine new order status
//     const newOrderStatus = determineOrderStatusFromItems(itemStatuses);

//     let updatedOrder = null;
//     let orderStatusChanged = false;

//     // Update order status if changed
//     if (newOrderStatus && order.status !== newOrderStatus) {
//       // If new status is CANCELLED, verify order can be cancelled using SAME helper
//       if (
//         newOrderStatus === 'CANCELLED' &&
//         !canCancelOrder(order.status as OrderStatusType)
//       ) {
//         throw new customeError(
//           httpStatus.BAD_REQUEST,
//           `Order cannot be cancelled because it is ${order.status.toLowerCase()}`
//         );
//       }

//       updatedOrder = await tx.orders.update({
//         where: { id: cancelledItem.orderId },
//         data: {
//           status: newOrderStatus,
//           updatedAt: new Date(),
//         },
//       });
//       orderStatusChanged = true;
//     }

//     // Prepare response message
//     let message = 'Order item cancelled successfully';
//     if (orderStatusChanged) {
//       if (newOrderStatus === 'CANCELLED') {
//         message = 'All items cancelled. Order has been cancelled.';
//       } else if (newOrderStatus === 'COMPLETE') {
//         message = 'All remaining items delivered. Order completed.';
//       } else {
//         message = `Item cancelled. Order status updated to ${newOrderStatus.toLowerCase()}.`;
//       }
//     }

//     return {
//       success: true,
//       cancelledItem,
//       order: updatedOrder || order,
//       orderStatusChanged,
//       previousOrderStatus: order.status,
//       currentOrderStatus: (updatedOrder || order).status,
//       message,
//     };
//   });

//   return result;
// };

// old updateOrderItemStatus

// const updateOrderItmeStatus = async (id: string, data: orderItemStatus) => {
//   const isOrderItemExist = await prisma.orderItems.findUnique({
//     where: { id },
//   });

//   if (!isOrderItemExist) {
//     throw new customeError(httpStatus.NOT_FOUND, 'Order Item not found.');
//   }

//   const result = await prisma.$transaction(async (tx) => {
//     // Update the order item status
//     const updatedItem = await tx.orderItems.update({
//       where: { id },
//       data: {
//         status: data.status,
//       },
//     });

//     if (!updatedItem) {
//       throw new customeError(
//         httpStatus.NOT_FOUND,
//         'Order Item not found. Please try to change another item status'
//       );
//     }

//     // Get the parent order with all items
//     const order = await tx.orders.findUnique({
//       where: {
//         id: updatedItem.orderId,
//       },
//       include: {
//         items: true,
//       },
//     });

//     if (!order) {
//       throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
//     }

//     // Check if all items are delivered
//     const allItemsDelivered = order.items.every(
//       (item) => item.status === 'DELIVERED'
//     );

//     // If all items are delivered, mark order as COMPLETE
//     if (allItemsDelivered && order.status !== 'COMPLETE') {
//       await tx.orders.update({
//         where: {
//           id: order.id,
//         },
//         data: {
//           status: 'COMPLETE',
//         },
//       });
//     }

//     return updatedItem;
//   });

//   return result;
// };

// new updateOrderItemStatus
const updateOrderItemStatus = async (
  id: string,
  data: { status: OrderItemStatusType }
) => {
  const isOrderItemExist = await prisma.orderItems.findUnique({
    where: { id },
  });

  if (!isOrderItemExist) {
    throw new customeError(httpStatus.NOT_FOUND, 'Order Item not found.');
  }

  const result = await prisma.$transaction(async (tx) => {
    // Update the order item status
    const updatedItem = await tx.orderItems.update({
      where: { id },
      data: {
        status: data.status,
        updatedAt: new Date(),
      },
    });

    if (!updatedItem) {
      throw new customeError(
        httpStatus.NOT_FOUND,
        'Order Item not found. Please try to change another item status'
      );
    }

    // Get the parent order with all items
    const order = await tx.orders.findUnique({
      where: {
        id: updatedItem.orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new customeError(httpStatus.NOT_FOUND, 'Order not found');
    }

    // Skip status update for terminal states
    if (isTerminalOrderStatus(order.status as OrderStatusType)) {
      return updatedItem;
    }

    // Get all item statuses
    const itemStatuses = order.items.map(
      (item) => item.status as OrderItemStatusType
    );

    // Determine new order status using the SINGLE helper function
    const newOrderStatus = determineOrderStatusFromItems(itemStatuses);

    // Update order status if changed
    if (newOrderStatus && order.status !== newOrderStatus) {
      await tx.orders.update({
        where: {
          id: order.id,
        },
        data: {
          status: newOrderStatus,
          updatedAt: new Date(),
        },
      });
    }

    return updatedItem;
  });

  return result;
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
  updateOrderItemStatus,
  getAllOrderItem,
};

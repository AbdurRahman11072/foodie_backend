// utils/orderStatusHelper.ts

export type OrderItemStatusType =
  | 'PENDING'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED';

export type OrderStatusType =
  | 'PENDING'
  | 'PREPARING'
  | 'DELIVERING'
  | 'COMPLETE'
  | 'CANCELLED';

/**
 * Determines the order status based on all order items statuses
 * This is the SINGLE source of truth for status determination
 */
export const determineOrderStatusFromItems = (
  itemStatuses: OrderItemStatusType[]
): OrderStatusType => {
  if (itemStatuses.length === 0) return 'PENDING';

  if (itemStatuses.every((status) => status === 'CANCELLED'))
    return 'CANCELLED';
  if (itemStatuses.every((status) => status === 'DELIVERED')) return 'COMPLETE';
  if (itemStatuses.every((status) => status === 'READY')) return 'DELIVERING';
  if (
    itemStatuses.some((status) => status === 'DELIVERED' || status === 'READY')
  )
    return 'DELIVERING';
  if (itemStatuses.some((status) => status === 'PREPARING')) return 'PREPARING';
  if (itemStatuses.some((status) => status !== 'PENDING')) return 'PREPARING';

  return 'PENDING';
};

/**
 * Check if order status is terminal (cannot be changed)
 */
export const isTerminalOrderStatus = (status: OrderStatusType): boolean => {
  return status === 'CANCELLED' || status === 'COMPLETE';
};

/**
 * Check if an item can be cancelled
 */
export const canCancelItem = (status: OrderItemStatusType): boolean => {
  const cancellableStatuses: OrderItemStatusType[] = ['PENDING', 'PREPARING'];
  return cancellableStatuses.includes(status);
};

/**
 * Check if order can be cancelled
 */
export const canCancelOrder = (status: OrderStatusType): boolean => {
  const cancellableStatuses: OrderStatusType[] = ['PENDING', 'PREPARING'];
  return cancellableStatuses.includes(status);
};

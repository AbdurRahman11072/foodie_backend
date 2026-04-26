import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { orderService } from './order.service';

const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders();

  customeResponse(res, httpStatus.OK, true, `All orders data`, result);
});
const getAllOrderItem = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrderItem();

  if (result.length === 0) {
    throw new customeError(httpStatus.NOT_FOUND, 'No order items found');
  }

  customeResponse(
    res,
    httpStatus.OK,
    true,
    `All orders items data found`,
    result
  );
});

const getOrderByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await orderService.getOrderByUserId(userId as string);

  customeResponse(res, httpStatus.OK, true, ` orders data found`, result);
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.getOrderById(id as string);

  customeResponse(res, httpStatus.OK, true, ` orders data found`, result);
});
const getOrderItemsByRestaurantId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.getOrderItemsByRestaurantId(id as string);

  customeResponse(res, httpStatus.OK, true, ` orders data found`, result);
});

const createOrder = asyncHandler(async (req, res) => {
  const data = req.body;

  const result = await orderService.createOrder(data);

  customeResponse(res, httpStatus.CREATED, true, `All orders data`, result);
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await orderService.updateOrder(id as string, data);

  customeResponse(res, httpStatus.OK, true, `All orders data`, result);
});
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.cancelOrder(id as string);

  customeResponse(res, httpStatus.OK, true, `Cancelled Order`, result);
});

const cancelOrderItems = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await orderService.cancelOrderItems(id as string);

  customeResponse(res, httpStatus.OK, true, `Cancelled Order Items`, result);
});

const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await orderService.updateOrderItemStatus(id as string, data);
  customeResponse(
    res,
    httpStatus.OK,
    true,
    `Order status has been changed into ${data}`,
    result
  );
});

export const orderController = {
  getAllOrders,
  createOrder,
  updateOrder,
  getOrderByUserId,
  getOrderById,
  cancelOrder,
  cancelOrderItems,
  getAllOrderItem,
  getOrderItemsByRestaurantId,
  updateOrderItemStatus,
};

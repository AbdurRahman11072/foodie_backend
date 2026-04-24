import httpStatus from 'http-status';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { orderService } from './order.service';

const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders();

  customeResponse(res, httpStatus.OK, true, `All orders data`, result);
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

const createOrder = asyncHandler(async (req, res) => {
  const data = req.body;

  const result = await orderService.createOrder(data);
  console.log(result);

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

const UpdateOrderItems = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  console.log(data);

  const result = await orderService.UpdateOrderItems(id as string, data);

  customeResponse(res, httpStatus.OK, true, `Cancelled Order Items`, result);
});

export const orderController = {
  getAllOrders,
  createOrder,
  updateOrder,
  getOrderByUserId,
  getOrderById,
  cancelOrder,
  UpdateOrderItems,
};

import httpStatus from 'http-status';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { reviewsService } from './reviews.service';

const getAllReviews = asyncHandler(async (req, res) => {
  const result = await reviewsService.getAllReviews();

  customeResponse(res, httpStatus.OK, true, `All reviews data`, result);
});
const createReviews = asyncHandler(async (req, res) => {
  const data = req.body;
  console.log(data);

  const result = await reviewsService.createReviews(data);

  customeResponse(
    res,
    httpStatus.CREATED,
    true,
    `Reviews created successfully`,
    result
  );
});
const updateReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await reviewsService.updateReviews(id as string, data);

  customeResponse(
    res,
    httpStatus.OK,
    true,
    `Review updataed successfully`,
    result
  );
});
const deleteReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await reviewsService.deleteReviews(id as string);
  customeResponse(
    res,
    httpStatus.OK,
    true,
    `Review deleted successfully`,
    result
  );
});

export const reviewsController = {
  getAllReviews,
  createReviews,
  updateReviews,
  deleteReviews,
};

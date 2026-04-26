import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { mealsServices } from './meals.service';

const getAllMeals = asyncHandler(async (req, res) => {
  const search =
    typeof req.query.search === 'string' ? req.query.search : undefined;
  const categoryTags = req.query.category
    ? (req.query.category as string).split(',')
    : [];
  const price = req.query.price
    ? parseFloat(req.query.price as string)
    : undefined;

  const page = req.query.page ? parseFloat(req.query.page as string) : 1;
  const limit = req.query.limit ? parseFloat(req.query.limit as string) : 10;

  const result = await mealsServices.getAllMeals({
    search,
    categoryTags,
    price,
    page,
    limit,
  });

  if (result.data.length === 0) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      'No meals available in database'
    );
  }
  customeResponse(res, httpStatus.OK, true, 'All meals data', result);
});

const createMeals = asyncHandler(async (req, res) => {
  const data = req.body;
  const userId = req.user?.id;

  const result = await mealsServices.createMeals(userId as string, data);

  customeResponse(
    res,
    httpStatus.CREATED,
    true,
    'Meals created successful',
    result
  );
});

const getMealsById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await mealsServices.getMealsById(id as string);

  if (result === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `No meals with the ( id:${id} ) available in database`
    );
  }
  customeResponse(res, httpStatus.OK, true, 'All meals data', result);
});

const getMealsByRestaurantId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await mealsServices.getMealsByRestaurantId(id as string);

  if (result === null) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `No meals with the ( id:${id} ) available in database`
    );
  }
  customeResponse(res, httpStatus.OK, true, 'All meals data', result);
});

const updateMealsInfo = asyncHandler(async (req, res) => {
  const restaurantId = req.user?.restaurantId;
  const data = req.body;
  const { id } = req.params;

  const result = await mealsServices.updateMealsInfo(
    restaurantId as string,
    id as string,
    data
  );
  customeResponse(
    res,
    httpStatus.OK,
    true,
    `meals information updated successfully`,
    result
  );
});

const featuredMeals = asyncHandler(async (req, res) => {
  const result = await mealsServices.featuredMeals();

  if (result.length === 0) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      `No meal has the requirement to be featured meal`
    );
  }
  customeResponse(res, httpStatus.OK, true, 'Featured meals data', result);
});

export const mealsController = {
  getAllMeals,
  createMeals,
  getMealsById,
  updateMealsInfo,
  getMealsByRestaurantId,
  featuredMeals,
};

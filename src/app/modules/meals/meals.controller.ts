import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { mealsServices } from './meals.service';

const getAllMeals = asyncHandler(async (req, res) => {
  const result = await mealsServices.getAllMeals();

  if (result.length === 0) {
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
  console.log('This route has been hit');

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
  const userId = req.user?.id;
  const data = req.body;
  const { id } = req.params;

  const result = await mealsServices.updateMealsInfo(
    userId as string,
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

export const mealsController = {
  getAllMeals,
  createMeals,
  getMealsById,
  updateMealsInfo,
  getMealsByRestaurantId,
};

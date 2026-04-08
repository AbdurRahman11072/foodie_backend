import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { CategoryService } from './catagory.service';

const getAllCategory = asyncHandler(async (req, res) => {
  const result = await CategoryService.getAllCategory();

  if (result.length === 0) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      'No Category data in database. Please create a Category'
    );
  }

  customeResponse(res, httpStatus.OK, true, 'All Category data', result);
});

const createCategory = asyncHandler(async (req, res) => {
  const data = req.body;
  console.log('Catagory route has been hit');

  console.log(data);

  const result = await CategoryService.createCategory(data);
  customeResponse(
    res,
    httpStatus.CREATED,
    true,
    'Category created successfully',
    result
  );
});
const updateCategoryInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await CategoryService.updateCategoryInfo(id as string, data);

  customeResponse(
    res,
    httpStatus.OK,
    true,
    'Category info updated successfully',
    result
  );
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await CategoryService.deleteCategory(id as string);

  customeResponse(
    res,
    httpStatus.OK,
    true,
    'Category deleted successfully',
    result
  );
});

export const CategoryController = {
  getAllCategory,
  createCategory,
  updateCategoryInfo,
  deleteCategory,
};

import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { catagoryService } from './catagory.service';

const getAllCatagory = asyncHandler(async (req, res) => {
  const result = await catagoryService.getAllCatagory();

  if (result.length === 0) {
    throw new customeError(
      httpStatus.NOT_FOUND,
      'No catagory data in database. Please create a catagory'
    );
  }

  customeResponse(res, httpStatus.OK, true, 'All catagory data', result);
});

const createCatagory = asyncHandler(async (req, res) => {
  const data = req.body;

  const result = await catagoryService.createCatagory(data);
  customeResponse(
    res,
    httpStatus.CREATED,
    true,
    'Catagory created successfully',
    result
  );
});
const updateCatagoryInfo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const result = await catagoryService.updateCatagoryInfo(id as string, data);

  customeResponse(
    res,
    httpStatus.OK,
    true,
    'Catagory info updated successfully',
    result
  );
});

const deleteCatagory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await catagoryService.deleteCatagory(id as string);

  customeResponse(
    res,
    httpStatus.OK,
    true,
    'Catagory deleted successfully',
    result
  );
});

export const catagoryController = {
  getAllCatagory,
  createCatagory,
  updateCatagoryInfo,
  deleteCatagory,
};

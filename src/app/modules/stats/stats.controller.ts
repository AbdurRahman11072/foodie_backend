import httpStatus from 'http-status';
import asyncHandler from '../../utils/asyncHandler';
import customeResponse from '../../utils/response';
import { statsService } from './stats.service';

const getAllStats = asyncHandler(async (req, res) => {
  const user = req.user;
  const role = user?.role;
  const resturantId = user?.restaurantId || undefined;

  const result = await statsService.getAllStats(
    resturantId as string,
    role as string
  );
  customeResponse(res, httpStatus.OK, true, 'All stats data', result);
});

export const statsController = {
  getAllStats,
};

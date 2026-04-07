import httpStatus from 'http-status';
import customeError from '../../error/customeError';
import asyncHandler from '../../utils/asyncHandler';
import { uploadOnCloudinary } from '../../utils/cloudinary';
import customeResponse from '../../utils/response';

const uploadImg = asyncHandler(async (req, res) => {
  const coverImg = await uploadOnCloudinary(req.file?.path as string);

  if (!coverImg) {
    throw new customeError(httpStatus.NOT_ACCEPTABLE, 'Failed to upload image');
  }

  customeResponse(res, httpStatus.CREATED, true, 'Image uploaded', coverImg);
});

export default uploadImg;

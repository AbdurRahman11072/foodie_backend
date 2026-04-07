import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import httpStatus from 'http-status';
import customeError from '../error/customeError';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string;
const apiKey = process.env.CLOUDINARY_API_KEY as string;
const apiSecret = process.env.CLOUDINARY_API_SECRET as string;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      throw new customeError(httpStatus.NOT_FOUND, 'Path not found');
    }

    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localFilePath);

    return res.url;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new customeError(httpStatus.BAD_REQUEST, 'Failed to upload file');
  }
};

import { Response } from 'express';

const customeResponse = (
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data: any
) => {
  res.status(status).json({
    success,
    message,
    data,
  });
};

export default customeResponse;

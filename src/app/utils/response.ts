import { Request, Response } from 'express';

const customeResponse = (
  status: number,
  success: boolean,
  message: string,
  data: any
) => {
  return async (req: Request, res: Response) => {
    res.status(status).json({
      success,
      message,
      data,
    });
  };
};

export default customeResponse;

import httpStatus from 'http-status';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';

const getAllUser = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  const take = limit;

  const data = await prisma.user.findMany({
    skip,
    take,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.user.count();

  return { data, total };
};

const updateUser = async (id: string, data: any) => {
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new customeError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  return await prisma.user.update({
    where: { id: id },
    data: data,
  });
};

const getUserById = async (id: string) => {
  return await prisma.user.findFirst({
    where: { id },
  });
};

export const userService = {
  getAllUser,
  updateUser,
  getUserById,
};

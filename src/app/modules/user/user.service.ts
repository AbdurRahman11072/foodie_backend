import httpStatus from 'http-status';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';

const getAllUser = async () => {
  return await prisma.user.findMany({
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });
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

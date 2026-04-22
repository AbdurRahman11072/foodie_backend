import { prisma } from '../../../lib/prisma';

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

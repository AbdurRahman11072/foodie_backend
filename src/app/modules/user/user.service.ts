import { prisma } from '../../../lib/prisma';

const getAllUser = async () => {
  return await prisma.user.findMany();
};

const updateUser = async (id: string, data: any) => {
  await prisma.user.update({
    where: { id: id },
    data: data,
  });
};

export const userService = {
  getAllUser,
  updateUser,
};

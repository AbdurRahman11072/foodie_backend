import { prisma } from '../../../lib/prisma';

const getAllUser = async () => {
  return await prisma.user.findMany();
};

export const userService = {
  getAllUser,
};

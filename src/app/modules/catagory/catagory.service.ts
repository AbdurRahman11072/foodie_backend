import httpStatus from 'http-status';
import { catagories } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';

const getAllCatagory = async () => {
  return await prisma.catagories.findMany();
};

const createCatagory = async (data: catagories) => {
  const isCatagoryExist = await prisma.catagories.findFirst({
    where: {
      name: data.name,
    },
  });

  if (isCatagoryExist !== null) {
    throw new customeError(httpStatus.BAD_REQUEST, 'catagory already exist');
  }
  return await prisma.catagories.create({
    data: data,
  });
};

const updateCatagoryInfo = async (id: string, data: Partial<catagories>) => {
  const isCatagoryExist = await prisma.catagories.findFirst({
    where: {
      id,
    },
  });

  if (isCatagoryExist === null) {
    throw new customeError(httpStatus.BAD_REQUEST, `catagory doesn't exist`);
  }

  return await prisma.catagories.update({
    where: { id },
    data: data,
  });
};
const deleteCatagory = async (id: string) => {
  const isCatagoryExist = await prisma.catagories.findFirst({
    where: {
      id,
    },
  });

  if (isCatagoryExist === null) {
    throw new customeError(httpStatus.BAD_REQUEST, `catagory doesn't exist`);
  }

  return await prisma.catagories.delete({
    where: { id },
  });
};

export const catagoryService = {
  getAllCatagory,
  createCatagory,
  updateCatagoryInfo,
  deleteCatagory,
};

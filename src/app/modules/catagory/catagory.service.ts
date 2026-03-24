import httpStatus from 'http-status';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';
import { catagory } from '../../generated/prisma/client';

const getAllCatagory = async () => {
  return await prisma.catagory.findMany();
};

const createCatagory = async (data: catagory) => {
  const isCatagoryExist = await prisma.catagory.findFirst({
    where: {
      name: data.name,
    },
  });

  if (isCatagoryExist !== null) {
    throw new customeError(httpStatus.BAD_REQUEST, 'catagory already exist');
  }
  return await prisma.catagory.create({
    data: data,
  });
};

const updateCatagoryInfo = async (id: string, data: Partial<catagory>) => {
  const isCatagoryExist = await prisma.catagory.findFirst({
    where: {
      id,
    },
  });

  if (isCatagoryExist === null) {
    throw new customeError(httpStatus.BAD_REQUEST, `catagory doesn't exist`);
  }

  return await prisma.catagory.update({
    where: { id },
    data: data,
  });
};
const deleteCatagory = async (id: string) => {
  const isCatagoryExist = await prisma.catagory.findFirst({
    where: {
      id,
    },
  });

  if (isCatagoryExist === null) {
    throw new customeError(httpStatus.BAD_REQUEST, `catagory doesn't exist`);
  }

  return await prisma.catagory.delete({
    where: { id },
  });
};

export const catagoryService = {
  getAllCatagory,
  createCatagory,
  updateCatagoryInfo,
  deleteCatagory,
};

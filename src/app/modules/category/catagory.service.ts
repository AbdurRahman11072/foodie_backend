import httpStatus from 'http-status';

import { categories } from '../../../generated/prisma/client';
import { prisma } from '../../../lib/prisma';
import customeError from '../../error/customeError';

const getAllCategory = async () => {
  return await prisma.categories.findMany();
};
type data = {
  name: string;
  coverImg: string;
};
const createCategory = async (data: data) => {
  const isCategoryExist = await prisma.categories.findFirst({
    where: {
      name: data.name,
    },
  });

  if (isCategoryExist !== null) {
    throw new customeError(httpStatus.BAD_REQUEST, 'Category already exist');
  }
  return await prisma.categories.create({
    data: data,
  });
};

const updateCategoryInfo = async (id: string, data: Partial<categories>) => {
  const isCategoryExist = await prisma.categories.findFirst({
    where: {
      id,
    },
  });

  if (isCategoryExist === null) {
    throw new customeError(httpStatus.BAD_REQUEST, `Category doesn't exist`);
  }

  return await prisma.categories.update({
    where: { id },
    data: data,
  });
};
const deleteCategory = async (id: string) => {
  const isCategoryExist = await prisma.categories.findFirst({
    where: {
      id,
    },
  });

  if (isCategoryExist === null) {
    throw new customeError(httpStatus.BAD_REQUEST, `Category doesn't exist`);
  }

  return await prisma.categories.delete({
    where: { id },
  });
};

export const CategoryService = {
  getAllCategory,
  createCategory,
  updateCategoryInfo,
  deleteCategory,
};

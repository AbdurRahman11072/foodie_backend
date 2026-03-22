import httpStatus from 'http-status';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

import { envConfig } from '../config.ts/envConfig';
import customeError from '../error/customeError';

const seedAdmin = async () => {
  try {
    const adminData = {
      name: envConfig.ADMIN_NAME as string,
      email: envConfig.ADMIN_EMAIL as string,
      password: envConfig.ADMIN_PASSWORD as string,
      role: 'admin',
    };

    console.log(adminData);

    const adminExist = await prisma.user.findFirst({
      where: {
        email: adminData.email as string,
      },
    });

    if (adminExist) {
      throw new customeError(httpStatus.FOUND, 'Admin account already exist');
    }
    const signUpAdmin = await auth.api.createUser({
      body: adminData as {
        name: string;
        email: string;
        password: string;
        role: 'admin';
      },
    });

    if (!signUpAdmin) {
      throw new customeError(
        httpStatus.BAD_REQUEST,
        'Failed to create admin account'
      );
    }
    const email: string = signUpAdmin?.user.email;

    const verifyEmail = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        emailVerified: true,
      },
    });

    if (!verifyEmail) {
      if (!signUpAdmin) {
        throw new customeError(
          httpStatus.BAD_REQUEST,
          'Failed to verify admin email account'
        );
      }
    }
    console.log('Admin account created successfully');
    process.exit(1);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();

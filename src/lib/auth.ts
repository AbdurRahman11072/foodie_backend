import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  baseURL: ' http://localhost:5000',
  trustedOrigins: ['http://localhost:3000'],
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },
});

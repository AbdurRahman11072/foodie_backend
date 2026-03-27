import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { envConfig } from '../app/config/envConfig';
import { prisma } from './prisma';
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  baseURL: `${envConfig.BACKEND_URL}`,
  trustedOrigins: [`${envConfig.FRONTEND_URL}`],
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),

  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
});

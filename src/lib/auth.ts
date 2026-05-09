import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { admin } from 'better-auth/plugins';
import { prisma } from './prisma';
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  baseURL: `${process.env.BACKEND_URL}`,
  trustedOrigins: [`${process.env.FRONTEND_URL}`],
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      restaurantId: {
        type: 'string',
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',  // ✅ Changed from 'lax' to 'none'
      secure: true,       // ✅ Required when using sameSite: 'none'
    },
  },
  plugins: [admin()],
});

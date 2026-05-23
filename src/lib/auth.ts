import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BACKEND_URL as string,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    process.env.FRONTEND_URL as string,
    process.env.BACKEND_URL as string,

    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean),

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      restaurantId: {
        type: "string",
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

  plugins: [admin()],
});

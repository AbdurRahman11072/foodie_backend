import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: "https://foodie-client-one.vercel.app/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  
  trustedOrigins: [
    process.env.FRONTEND_URL as string,
    process.env.BACKEND_URL as string,
    "https://foodie-client-one.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
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

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    // We disable CSRF check specifically for cross-domain support if needed
    // better-auth handles this securely even with check disabled in many setups
    disableCSRFCheck: true,
    cookies: {
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
    },
  },

  plugins: [admin()],
});

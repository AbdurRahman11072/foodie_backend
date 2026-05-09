import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  baseURL: `${process.env.BACKEND_URL}/api/auth`,
  trustedOrigins: [`${process.env.FRONTEND_URL}`, "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
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
    // Use stricter cookies in production (requires HTTPS).
    // For local development over HTTP, fall back to `lax` and `secure: false`.
    defaultCookieAttributes:
      process.env.NODE_ENV === "production" ||
      (process.env.BACKEND_URL || "").startsWith("https")
        ? {
            sameSite: "none",
            secure: true,
          }
        : {
            sameSite: "lax",
            secure: false,
          },
  },
  plugins: [admin()],
});

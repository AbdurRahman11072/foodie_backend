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
    // Remove crossSubDomainCookies — it only works for subdomains
    // (like app.example.com → api.example.com), not for completely
    // different domains like yours.

    defaultCookieAttributes: {
      sameSite: "none", // allows cross-site cookie sending
      secure: true, // required whenever sameSite is "none"
      httpOnly: true, // security best practice
      partitioned: true, // for CHIPS / newer browser support
    },
  },
  plugins: [admin()],
});

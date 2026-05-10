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
    crossSubDomainCookies: {
      // Enable only when a cookie domain is explicitly provided via env
      enabled: Boolean(process.env.NEXT_PUBLIC_COOKIE_DOMAIN),
      // Only include the `domain` key when an env value is present —
      // this avoids assigning `undefined` which breaks with
      // `exactOptionalPropertyTypes: true`.
      ...(process.env.NEXT_PUBLIC_COOKIE_DOMAIN
        ? { domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN }
        : {}),
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  },
  plugins: [admin()],
});

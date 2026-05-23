import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import { RootRoutes } from "./app/routes";

import { auth } from "./lib/auth";

const app: Application = express();

// Required for Better Auth to work correctly behind proxies like Render/Vercel
app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.FRONTEND_URL,
        "https://foodie-client-one.vercel.app",
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth/*spalt", toNodeHandler(auth));
app.use("/api/v1", RootRoutes);

app.get("/", async (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to foodie",
    data: null,
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;

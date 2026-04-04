import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import { RootRoutes } from './app/routes';

import { auth } from './lib/auth';

const app: Application = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true,
  })
);
app.use(express.json());

app.all('/api/auth/*spalt', toNodeHandler(auth));
app.use('/api/v1', RootRoutes);

app.get('/', async (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to foodie',
    data: null,
  });
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;

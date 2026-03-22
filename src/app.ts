import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';
import { auth } from './lib/auth';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.all('/api/auth/*spalt', toNodeHandler(auth));

app.get('/', async (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to foodie',
    data: null,
  });
});

export default app;

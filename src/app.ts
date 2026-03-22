import cors from 'cors';
import express, { Application } from 'express';
import httpStatus from 'http-status';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.get('/', async (req, res) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to foodie',
    data: null,
  });
});

export default app;

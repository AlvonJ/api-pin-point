import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { userRouter } from './adapter/route/userRouter.js';
import { groupRouter } from './adapter/route/groupRouter.js';
import { attendanceRouter } from './adapter/route/attendanceRouter.js';
import { AppError } from './adapter/utils/AppError.js';

export function createApp() {
  const app: Express = express();

  // Middlware
  app.use(cors());
  app.use(compression());
  app.use(cookieParser());
  app.use(bodyParser.json());

  // Routers
  app.use('/users', userRouter);
  app.use('/groups', groupRouter);
  app.use('/attendances', attendanceRouter);

  // Catch unhandled routes (MIDDLEWARE)
  app.all('*', function (req: Request, res: Response, next: NextFunction) {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Error handling middleware
  app.use(function (err: AppError, req: Request, res: Response, next: NextFunction) {
    if (!err.statusCode) err.statusCode = 500;

    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  });

  return app;
}

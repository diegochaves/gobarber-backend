import 'dotenv/config';
import { resolve } from 'path';
import Youch from 'youch';
import express from 'express';
import 'express-async-errors';
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (error, request, response, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(error, request).toJSON();
        return response.status(500).json(errors);
      }
      return response.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server;

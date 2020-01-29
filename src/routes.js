import { Router } from 'express';

const routes = new Router();

routes.use('/', (request, response) =>
  response.json({ message: 'Hello World!' })
);

export default routes;

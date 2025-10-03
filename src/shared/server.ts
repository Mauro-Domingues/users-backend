import { app } from './app';

setImmediate(app.init.bind(app));

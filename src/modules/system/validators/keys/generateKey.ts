import { celebrate, Segments, Joi } from 'celebrate';

export const generateKey = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});

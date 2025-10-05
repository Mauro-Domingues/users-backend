import { celebrate, Segments, Joi } from 'celebrate';

export const showSelfUser = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});

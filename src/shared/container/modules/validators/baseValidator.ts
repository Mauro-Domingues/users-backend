import type { CelebrateOptions, SchemaOptions } from 'celebrate';
import { celebrate, Joi } from 'celebrate';
import type { RequestHandler } from 'express';
import type { Root, ValidationOptions } from 'joi';

export const baseValidator = (
  requestRules: (ctx: Root) => SchemaOptions,
  joiOpts?: ValidationOptions,
  celebrateOpts?: CelebrateOptions,
): RequestHandler<never, never, never, never> => {
  return celebrate(requestRules(Joi), joiOpts, celebrateOpts);
};

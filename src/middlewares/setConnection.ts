import { Request, Response, NextFunction } from 'express';
import { Connection } from '@shared/typeorm';

/**
 * @description Defaults to the process.env database, but supports multi-tenancy
 */
export const setConnection = async (
  request: Request,
  _response: Response,
  next: NextFunction,
): Promise<void> => {
  const client = request.headers['tenant-id'] as string;
  request.dbConnection = new Connection(client);
  await request.dbConnection.connect();

  return next();
};

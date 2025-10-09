declare namespace Express {
  export interface Request {
    readonly files: Array<Express.Multer.File>;
    readonly user: {
      readonly email: string;
      readonly sub: string;
    };
    dbConnection: import('@shared/typeorm').IConnection;
  }
}

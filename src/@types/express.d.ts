declare namespace Express {
  export interface Request {
    readonly user: {
      readonly email: string;
      readonly sub: string;
    };
  }
}

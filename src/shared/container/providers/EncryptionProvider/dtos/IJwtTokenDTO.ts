export interface IJwtTokenDTO {
  token: string;
  type: 'Bearer';
  expiresIn: number;
}

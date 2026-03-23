export interface IAuthDTO {
  email: string;
  password: string;
  refreshToken?: string;
  deviceId?: string;
}

export interface IOAuth2CallbackDTO {
  error:
    | 'access_denied'
    | 'server_error'
    | 'temporarily_unavailable'
    | 'invalid_request'
    | 'unauthorized_client'
    | 'unsupported_response_type';
  code: string;
  state: string;
  scope: string;
  authuser: 0 | 1;
  prompt: string;
  hd: string;
}

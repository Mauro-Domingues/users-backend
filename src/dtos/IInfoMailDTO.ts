export interface IInfoMailDTO {
  templateData: {
    message: string;
    subject: string;
    info: Array<string>;
    name?: string;
    buttonText?: string;
    buttonUrl?: string;
    anchorText?: string;
    anchorUrl?: string;
  };
  to: {
    name: string;
    email: string;
  };
  from?: { name: string; email: string };
}

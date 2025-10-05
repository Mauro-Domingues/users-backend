import { IHEXColorDTO } from './IHEXColorDTO';

export interface IInfoMailStyleDTO {
  layout: {
    backgroundColor: IHEXColorDTO;
    lineColor: IHEXColorDTO;
  };
  logo: {
    url: string;
    borderColor: IHEXColorDTO;
  };
  font: {
    primaryColor: IHEXColorDTO;
    secondaryColor: IHEXColorDTO;
    highlightedColor: IHEXColorDTO;
  };
  button: {
    primaryColor: IHEXColorDTO;
    secondaryColor: IHEXColorDTO;
  };
}

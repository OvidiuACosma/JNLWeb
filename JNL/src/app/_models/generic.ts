export interface Img {
  src: string;
  alt: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface Browser {
  name: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;
}

export class RequestForm {
  id?: number;
  type = 0;
  subject = '';
  message = '';
  name = '';
  surname = '';
  company = '';
  country = '';
  address = '';
  city = '';
  county = '';
  zip = '';
  email = '';
  newsletterSubscribed = false;
  projectType = 0;
  catalogueReq = false;
  contactReq = false;
  quotationReq = false;
  relationId = '';
  subscriber = 0;
  activity = '';
  product = '';
  favId = 0;
}

export interface IDialogData {
  title: string;
  text: string;
  buttons: number[];
}

export interface IPriceListDialogData {
  title: string;
  language: string;
  languages: string[];
  collections: string[];
  labels: string[];
}

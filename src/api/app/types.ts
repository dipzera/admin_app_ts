import { ApiDecorator, ApiRequest } from "../types";

export type CreateMarketPackage = ApiDecorator<
  ApiRequest,
  "AppPackage",
  IAppPackage
> &
  ApiDecorator<ApiRequest, "MarketAppID", number>;

export interface IUsers {
  Company: string;
  CompanyID: number;
  Email: string;
  FirstName: string;
  LastName: string;
  ID: number;
  LastAuthorize: string;
  LastAuthorizeIP: string;
  PhoneNumber: string;
  Photo: string;
  Status: number;
  UiLanguage: number;
}

export interface IBasicCompanyList {
  ID: number;
  Logo?: string;
  Name: string;
  Status?: string;
}

export interface ICompanyData {
  BIC?: string;
  Bank?: string;
  Email?: string;
  CommercialName?: string;
  CountryID?: number;
  ID?: number;
  IBAN?: string;
  IDNO?: string;
  IsVATPayer?: boolean;
  JuridicalAddress?: string;
  JuridicalName?: string;
  Logo?: string;
  OfficeAddress?: string;
  PostalCode?: string;
  ShortName?: string;
  PhoneNumber?: string;
  Status?: number;
  VATCode?: number;
  WebSite?: string;
}

export interface IAppPackage {
  ID: number;
  MaxValue: number;
  MinValue: number;
  Name: string;
  Price: number;
  SortIndex: number;
  Status: number;
  ValidFrom: string;
  ValidTo: string;
}
export interface IMarketAppList {
  AppType?: number;
  ApyKey?: string;
  BackOfficeURI?: string;
  ID: number;
  LicenseActivationCode?: number;
  LicenseActivationCodeValidHours?: number;
  LicenseActivationCodeValidTo?: string;
  ShortDescription: ILocale | string;
  LongDescription: ILocale | string;
  Name: string;
  Packages?: IAppPackage[];
  Photo: string;
  Status?: number;
  TermsOfUse: ILocale | string | undefined;
}

export interface ILocale {
  en: string;
  ro: string;
  ru: string;
}

export interface INewsList {
  Content: string;
  CreateDate?: any;
  Header: string;
  ID: number;
  Photo: string;
  ProductType: number;
  Status?: number;
}

export interface IUser {
  Company?: string;
  CompanyID?: number;
  CreateDate?: string;
  Email: string;
  FirstName: string;
  ID: string;
  LastAuthorize?: string;
  LastAuthorizeIP?: string;
  LastName: string;
  PhoneNumber: string;
  Photo: string;
  Status: number;
  UiLanguage: number;
}

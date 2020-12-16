import { ICompanyData, IPackages } from "./types.response";

interface ApiRequest {
    Token?: string;
}

/* Auth */
export interface IAuthorizeUserRequest {
    Email: string;
    Password: string;
    info?: string;
}

export interface IRegisterUserRequest extends ApiRequest {
    CompanyID: number;
    Email: string;
    FirstName: string;
    LastName: string;
    UiLanguage?: number;
}

export interface IChangePasswordRequest extends ApiRequest {
    NewPassword: string;
    OldPassword: string;
}

export interface IAppPackageRequest {
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
export interface ICreateMarketAppPackageRequest extends ApiRequest {
    AppPackage: IAppPackageRequest[];
    MarketAppID: number;
}
export interface IDeleteMarketAppPackageRequest extends ApiRequest {
    ID: number;
}

export interface IRegisterClientCompanyRequest extends ApiRequest {
    Company: ICompanyData;
    info?: string;
}

export interface IUpdateCompanyRequest extends ApiRequest {
    Company: ICompanyData;
    info?: string;
}

export interface IAppRequest {
    BackOfficeURI?: string;
    ID: number;
    LongDescription: any;
    Name: string;
    Photo: string;
    ShortDescription: any;
    Status?: number;
    TermsOfUse: any;
}
export interface IUpdateMarketAppRequest extends ApiRequest {
    App: IAppRequest;
}
export interface IUpdatePackageRequest extends ApiRequest {
    AppPackage: IPackages;
}

export interface IUpdateNewsRequest extends ApiRequest {
    NewsData: {
        Content: string;
        CreateDate?: string;
        Header: string;
        ID: number;
        Photo: string;
        ProductType: number;
        Status?: number;
    };
}

export interface IUpdateUserRequest extends ApiRequest {
    User: {
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
    };
}

export interface IActivateUserRequest extends ApiRequest {
    Token: string;
}

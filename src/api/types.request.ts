interface ApiRequest {
    Token?: string;
}
export interface IAuthorizeUser {
    Email: string;
    Password: string;
    info?: string;
}

export interface IRegisterUser extends ApiRequest {
    CompanyID: number;
    Email: string;
    FirstName: string;
    LastName: string;
    UiLanguage?: number;
}

export interface IChangePassword extends ApiRequest {
    NewPassword: string;
    OldPassword: string;
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
export interface ICreateMarketAppPackage extends ApiRequest {
    AppPackage: IAppPackage[];
    MarketAppID: number;
}
export interface IDeleteMarketAppPackage extends ApiRequest {
    ID: number;
}

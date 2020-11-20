export interface Package {
    ID: number;
    MaxValue: number;
    MinValue: number;
    Name: string;
    Price: number;
    Status: number;
    ValidFrom: string;
    ValidTo: string;
}
export interface IMarketAppList {
    AppType: number;
    ApyKey: string;
    ID: number;
    LicenseActivationCode: number;
    LicenseActivationCodeValidHours: number;
    LicenseActivationCodeValidTo: string;
    LongDescription: string;
    Name: string;
    Packages: Package[];
    Photo: string;
    ShortDescription: string;
    Status: number;
    TermsOfUse: string;
}
export interface IUsers {
    Company: string;
    CompanyID: number;
    CreateDate: string;
    Email: string;
    FirstName: string;
    ID: number;
    LastAuthorize: string;
    LastAuthorizeIP: string;
    LastName: string;
    PhoneNumber: string;
    Photo: string;
    Status: string;
    UiLanguage: number;
}

export interface ApiResponse<T> {
    ErrorCode: number;
    ErrorMessage: string;
    [extra: string]: T | number | string;
}

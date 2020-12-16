export interface ApiResponse {
    ErrorCode: number;
    ErrorMessage: string;
}

export interface IChangeCompanyStatus extends ApiResponse {}

export interface IChangeMarketAppStatus extends ApiResponse {}

export interface IChangeUserStatus extends ApiResponse {}

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
export interface IGetAllUsersInfo extends ApiResponse {
    Users: IUsers[];
}

export interface IBasicCompanyList {
    ID: number;
    Logo?: string;
    Name: string;
    Status?: string;
}
export interface IGetBasicCompaniesList extends ApiResponse {
    CompanyList: IBasicCompanyList[];
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
    Status?: number;
    VATCode?: number;
    WebSite?: string;
}
export interface IGetCompanyInfo extends ApiResponse {
    Company: ICompanyData;
}

export interface IGetCompanyList extends ApiResponse {
    CompanyList: ICompanyData[];
}

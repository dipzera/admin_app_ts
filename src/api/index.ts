import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import { authenticated, hideLoading, signOut } from "../redux/actions/Auth";
import { IAccount } from "../redux/reducers/Account";
import store from "../redux/store";
import WithStringTranslate from "../utils/translate";
import {
  IActivateUserRequest,
  IAuthorizeUserRequest,
  IChangePasswordRequest,
  ICreateMarketAppPackageRequest,
  IRegisterClientCompanyRequest,
  IRegisterUserRequest,
  IUpdateCompanyRequest,
  IUpdateNewsRequest,
} from "./types.request";
import {
  IActivateUserResponse,
  IAuthorizeUserResponse,
  IChangeCompanyStatusResponse,
  IChangeMarketAppStatusResponse,
  IChangePasswordResponse,
  IChangeUserStatusResponse,
  ICompanyData,
  IDeleteMarketAppPackageResponse,
  IGetAllUsersInfoResponse,
  IGetBasicCompaniesListResponse,
  IGetCompanyInfoResponse,
  IGetCompanyListResponse,
  IGetManagedTokenResponse,
  IGetMarketAppListResponse,
  IGetNewsResponse,
  IGetProfileInfoResponse,
  IMarketAppList,
  INewsList,
  IPackages,
  IRefreshTokenResponse,
  IRegisterClientCompanyResponse,
  IRegisterUserResponse,
  IResetPasswordResponse,
  ISendActivationCodeResponse,
  IUpdateMarketAppResponse,
  IUpdateNewsResponse,
  IUpdatePackageResponse,
  IUpdateUserResponse,
} from "./types.response";
const publicIp = require("react-public-ip");

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}

class HttpClient {
  public readonly instance: AxiosInstance;
  public _token: string;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
    this._token = store.getState().auth.token;
    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }

  public _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };
  public _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      (config) => {
        console.log(config);
        if (config.method === "get") {
          config.params = {
            Token: this._token,
            ...config.params,
          };
        }
        if (config.method === "post") {
          config.data = {
            ...config.data,
            Token: this._token,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  };

  private _RefreshToken = async () =>
    this.instance.get<IRefreshTokenResponse>(`${API_AUTH_URL}/RefreshToken`);

  private _handleResponse = async (response: AxiosResponse) => {
    console.log(response);
    if (response.data.ErrorCode === 118) {
      return await this._RefreshToken().then(async (data) => {
        if (data) {
          const { ErrorCode, Token } = data;
          if (ErrorCode === 0) {
            store.dispatch(authenticated(Token));
            if (response.config.method === "get") {
              response.config.params = {
                ...response.config.params,
                Token,
              };
              return await axios
                .request(response.config)
                .then((response) => response.data);
            }
            if (response.config.method === "post") {
              response.config.data = {
                ...JSON.parse(response.config.data),
                Token,
              };
              return await axios
                .request(response.config)
                .then((response) => response.data);
            }
          } else {
            const key = "updatable";
            message
              .loading({
                content: WithStringTranslate("message.ExpireTime"),
                key,
                duration: 1.5,
              })
              .then(() => {
                store.dispatch(signOut());
              });
          }
        }
      });
    } else if (
      response.data.ErrorCode !== 0 &&
      response.data.ErrorCode !== 108 &&
      response.data.ErrorCode !== -1
    ) {
      message.error({
        content: response.data.ErrorMessage,
        key: "updatable",
        duration: 2.5,
      });
    }
    if (response && response.data) return response.data;
  };
  private _handleError = async (error: AxiosResponse) => {
    if (error.request.status !== 200) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 10,
      });
    }
    store.dispatch(hideLoading());
  };
}
export class AuthService extends HttpClient {
  public constructor() {
    super(`${API_AUTH_URL}`);
  }

  public Login = async (data: IAuthorizeUserRequest) =>
    this.instance.post<IAuthorizeUserResponse>("/AuthorizeUser", {
      ...data,
      info: (await publicIp.v4()) || ("" as string),
    });

  public SendActivationCode = async (UserID?: number) =>
    this.instance.get<ISendActivationCodeResponse>("/SendActivationCode", {
      params: { UserID },
    });

  public ResetPassword = async (Email: string) =>
    this.instance.post<IResetPasswordResponse>("/ResetPassword", {
      Email,
      info: (await publicIp.v4()) || "",
    });

  public RegisterUser = async (data: IAccount) =>
    this.instance.post<IRegisterUserResponse>("/RegisterUser", {
      ...data,
    });

  public GetManagedToken = async (CompanyID: number) =>
    this.instance.get<IGetManagedTokenResponse>("/GetManagedToken", {
      params: { CompanyID },
    });

  public ChangePassword = async (data: IChangePasswordRequest) =>
    this.instance.post<IChangePasswordResponse>("/ChangePassword", data);

  public ActivateUser = async (params: IActivateUserRequest) =>
    this.instance.get<IActivateUserResponse>("/ActivateUser", {
      params /* Param is a token took from the browser url */,
    });
}

export class AppService extends HttpClient {
  public constructor() {
    super(`${API_APP_URL}`);
  }

  public GetAllUsers = async () =>
    this.instance.get<IGetAllUsersInfoResponse>("/GetAllUsersInfo");

  public GetCompanyList = async () =>
    this.instance.get<IGetCompanyListResponse>("/GetCompanyList");

  public GetBasicCompanyList = async () =>
    this.instance.get<IGetBasicCompaniesListResponse>("/GetBasicCompaniesList");

  public ChangeCompanyStatus = async (ID: number, Status: number) =>
    this.instance.get<IChangeCompanyStatusResponse>("/ChangeCompanyStatus", {
      params: {
        ID,
        Status,
      },
    });

  public ChangeUserStatus = async (ID: number, Status: number) =>
    this.instance.get<IChangeUserStatusResponse>("/ChangeUserStatus", {
      params: {
        ID,
        Status,
      },
    });
  public UpdateUser = async (data: IAccount) =>
    this.instance.post<IUpdateUserResponse>("/UpdateUser", {
      User: {
        ...data,
      },
    });

  public RegisterClientCompany = async (data: ICompanyData) =>
    this.instance.post<IRegisterClientCompanyResponse>(
      "/RegisterClientCompany",
      {
        Company: {
          ...data,
        },
        info: (await publicIp.v4()) || "",
      }
    );

  public UpdateCompany = async (data: IUpdateCompanyRequest) =>
    this.instance.post("/UpdateCompany", {
      ...data,
      info: (await publicIp.v4()) || "",
    });

  public GetProfileInfo = async () =>
    this.instance.get<IGetProfileInfoResponse>("/GetProfileInfo");

  public GetCompanyInfo = async () =>
    this.instance.get<IGetCompanyInfoResponse>("/GetCompanyInfo");

  public GetMarketAppList = async () =>
    this.instance.get<IGetMarketAppListResponse>("/GetMarketAppList");

  public UpdateMarketApp = async (App: IMarketAppList) =>
    this.instance.post<IUpdateMarketAppResponse>("/UpdateMarketApp", {
      App,
    });

  public CreateMarketAppPackage = async (
    Package: ICreateMarketAppPackageRequest
  ) => this.instance.post("/CreateMarketAppPackage", Package);

  public UpdateMarketAppPackage = async (AppPackage: IPackages) =>
    this.instance.post<IUpdatePackageResponse>("/UpdateMarketAppPackage", {
      AppPackage,
    });

  public DeleteMarketAppPackage = async (ID: number) =>
    this.instance.post<IDeleteMarketAppPackageResponse>(
      "/DeleteMarketAppPackage",
      {
        ID,
      }
    );

  public ChangeMarketAppStatus = async (ID: number, Status: number) =>
    this.instance.get<IChangeMarketAppStatusResponse>(
      "/ChangeMarketAppStatus",
      {
        params: { ID, Status },
      }
    );

  public GetNews = async (ProductType: number) =>
    this.instance.get<IGetNewsResponse>("/GetNews", {
      params: {
        ProductType,
      },
    });

  public UpdateNews = async (NewsData: any) =>
    this.instance.post<IUpdateNewsResponse>("/UpdateNews", {
      NewsData,
    });
}

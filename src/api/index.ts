import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import {
    DONE,
    EMAIL_CONFIRM_MSG,
    EXPIRE_TIME,
    INTERNAL_ERROR,
} from "../constants/Messages";
import { authenticated, hideLoading, signOut } from "../redux/actions/Auth";
import store from "../redux/store";
import ReactDOMServer from "react-dom/server";
import Localization from "../utils/Localization";
const publicIp = require("react-public-ip");
declare module "axios" {
    interface AxiosResponse<T = any> extends Promise<T> {}
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
        this.instance.interceptors.request.use((config) => {
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
        });
    };

    private _RefreshToken = () =>
        this.instance.get(`${API_AUTH_URL}/RefreshToken`);

    public _handleResponse = async (response: AxiosResponse) => {
        console.log(response);
        if (response.data.ErrorCode === 118) {
            return this._handleError(response);
        } else if (
            response.data.ErrorCode !== 0 &&
            response.data.ErrorCode !== 118
        ) {
            message.error({
                content: response.data.ErrorMessage,
                key: "updatable",
            });
        }
        return response.data;
    };
    public _handleError = async (error: any) => {
        if (error.config && error.data && error.data.ErrorCode === 118) {
            return this._RefreshToken().then(async (data: any) => {
                if (data) {
                    const { ErrorCode, Token } = data;
                    if (ErrorCode === 0) {
                        store.dispatch(authenticated(Token));
                        if (error.config.method === "get") {
                            error.config.params = {
                                ...error.config.params,
                                Token,
                            };
                            return await axios
                                .request(error.config)
                                .then((response) => response.data);
                        }
                        if (error.config.method === "post") {
                            error.config.data = {
                                ...JSON.parse(error.config.data),
                                Token,
                            };
                            return await axios
                                .request(error.config)
                                .then((response) => response.data);
                        }
                    } else {
                        const key = "updatable";
                        message
                            .loading({
                                content: ReactDOMServer.renderToString(
                                    EXPIRE_TIME()
                                ),
                                key,
                            })
                            .then(() => {
                                store.dispatch(signOut());
                            });
                    }
                }
            });
        }
        store.dispatch(hideLoading());
    };
}
export class AuthApi extends HttpClient {
    public constructor() {
        super(`${API_AUTH_URL}`);
    }

    public Login = async (data: { [key: string]: any }) =>
        this.instance.post("/AuthorizeUser", {
            ...data,
            info: (await publicIp.v4()) || ("" as string),
        });

    public RefreshToken = () => this.instance.get("/RefreshToken");

    public SendActivationCode = (UserID?: number) =>
        this.instance.get("/SendActivationCode", {
            params: { UserID },
        });

    public ResetPassword = async (Email: string) =>
        this.instance.post("/ResetPassword", {
            Email,
            info: (await publicIp.v4()) || "",
        });

    public RegisterUser = (data: { [key: string]: string | number }) =>
        this.instance.post("/RegisterUser", data);

    public GetManagedToken = (CompanyID: number) =>
        this.instance.get("/GetManagedToken", {
            params: { CompanyID },
        });

    public ChangePassword = (data: { [key: string]: string }) =>
        this.instance.post("/ChangePassword", data);

    public ActivateUser = (params: { [key: string]: string }) =>
        this.instance.get("/ActivateUser", {
            params /* Param is a token took from the browser url */,
        });
}

export class AdminApi extends HttpClient {
    public constructor() {
        super(`${API_APP_URL}`);
    }

    public GetAllUsers = () => this.instance.get("/GetAllUsersInfo");

    public GetCompanyList = () => this.instance.get("/GetCompanyList");

    public GetBasicCompanyList = () =>
        this.instance.get("/GetBasicCompaniesList");

    public ChangeCompanyStatus = (ID: number, Status: number) =>
        this.instance.get("/ChangeCompanyStatus", {
            params: {
                ID,
                Status,
            },
        });

    public ChangeUserStatus = (ID: number, Status: number) =>
        this.instance.get("/ChangeUserStatus", {
            params: {
                ID,
                Status,
            },
        });
    public UpdateUser = async (data: { [key: string]: any }) =>
        this.instance.post("/UpdateUser", {
            ...data,
            info: await publicIp.v4(),
        });

    public RegisterClientCompany = async (data: {
        [key: string]: string | number;
    }) =>
        this.instance.post("/RegisterClientCompany", {
            ...data,
            info: (await publicIp.v4()) || "",
        });

    public UpdateCompany = async (data: { [key: string]: string | number }) =>
        this.instance.post("/UpdateCompany", {
            ...data,
            info: (await publicIp.v4()) || "",
        });

    public GetProfileInfo = () => this.instance.get("/GetProfileInfo");

    public GetCompanyInfo = () => this.instance.get("/GetCompanyInfo");

    public GetMarketAppList = () => this.instance.get("/GetMarketAppList");

    public UpdateMarketApp = (App: { [key: string]: any }) =>
        this.instance.post("/UpdateMarketApp", {
            App,
        });

    public CreateMarketAppPackage = (
        data: { [key: string]: any },
        MarketAppID: number
    ) =>
        this.instance.post("/CreateMarketAppPackage", {
            AppPackage: {
                ...data,
            },
            MarketAppID,
        });

    public UpdateMarketAppPackage = (AppPackage: { [key: string]: any }) =>
        this.instance.post("/UpdateMarketAppPackage", {
            AppPackage,
        });

    public DeleteMarketAppPackage = (ID: number) =>
        this.instance.post("/DeleteMarketAppPackage", {
            ID,
        });

    public ChangeMarketAppStatus = (ID: number, Status: number) =>
        this.instance.get("/ChangeMarketAppStatus", {
            params: { ID, Status },
        });

    public GetNews = () => this.instance.get("/GetNews");

    public UpdateNews = (data: any) =>
        this.instance.post("/UpdateNews", {
            ...data,
        });
}

import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import { EMAIL_CONFIRM_MSG, INTERNAL_ERROR } from "../constants/Messages";
import { hideLoading, refreshToken } from "../redux/actions/Auth";
import store from "../redux/store";
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
        this.instance.interceptors.request.use((config) => {
            if (config.method === "get") {
                config.params = {
                    Token: this._token,
                    ...config.params,
                };
            }
            return config;
        });
    };

    public _handleResponse = ({ data }: AxiosResponse) => {
        if (data.ErrorCode === 118) {
            store.dispatch(refreshToken());
        }
        return data;
    };
    public _handleError = (error: any) => {
        store.dispatch(hideLoading());
        const key = "updatable";
        message.error({ content: error.toString(), key });
    };
}

export class AdminApi extends HttpClient {
    public constructor() {
        super(`${API_APP_URL}`);
    }

    public GetAllUsers = () => this.instance.get("/GetAllUsersInfo");

    public GetCompanyList = () => this.instance.get("/GetCompanyList");

    public GetBasicCompanyList = () =>
        this.instance.get("/GetBasicCompaniesList");

    public ChangeCompanyStatus = (ID, Status) =>
        this.instance.get("/ChangeCompanyStatus", {
            params: {
                ID,
                Status,
            },
        });

    public ChangeUserStatus = (ID, Status) =>
        this.instance.get("/ChangeUserStatus", {
            params: {
                ID,
                Status,
            },
        });
    public UpdateUser = (data) => this.instance.post("/UpdateUser", data);

    public RegisterClientCompany = async (data) =>
        this.instance.post("/RegisterClientCompany", {
            ...data,
            Token: this._token,
            info: (await publicIp.v4()) || "",
        });

    public UpdateCompany = async (data) =>
        this.instance.post("/UpdateCompany", {
            ...data,
            Token: this._token,
            info: (await publicIp.v4()) || "",
        });
}

export class AuthApi extends HttpClient {
    public constructor() {
        super(`${API_AUTH_URL}`);
    }

    public Login = async (data) =>
        this.instance.post("/AuthorizeUser", {
            ...data,
            info: (await publicIp.v4()) || ("" as string),
        });

    public RefreshToken = () => this.instance.get("/RefreshToken");

    public SendActivationCode = () => this.instance.get("/SendActivationCode");

    public ResetPassword = async (Email) =>
        this.instance.post("/ResetPassword", {
            Email,
            info: (await publicIp.v4()) || "",
        });

    public RegisterUser = (data) => this.instance.post("/RegisterUser", data);

    public GetManagedToken = (CompanyID) =>
        this.instance.get("/GetManagedToken", {
            params: { CompanyID },
        });

    public ChangePassword = (data) =>
        this.instance.post("/ChangePassword", data);

    public ActivateUser = (params) =>
        this.instance.get("/ActivateUser", {
            params,
        });
}

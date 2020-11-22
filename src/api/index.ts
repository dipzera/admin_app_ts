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

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });
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
            if (
                config.method === "get" &&
                config.baseURL === `${API_APP_URL}`
            ) {
                config.params = {
                    Token: store.getState().auth.token,
                };
            }
            return config;
        });
    };

    public _handleResponse = ({ data }: AxiosResponse) => {
        if (data.ErrorCode === 118) {
            store.dispatch(refreshToken(store.getState().auth.token));
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

    public getAllUsers = () => this.instance.get("/GetAllUsersInfo");
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

    public RefreshToken = (Token) =>
        this.instance.get("/RefreshToken", {
            params: { Token },
        });

    public SendActivationCode = (Token) =>
        this.instance.get("/SendActivationCode", {
            params: { Token },
        });

    public ResetPassword = async (Email) =>
        this.instance.post("/ResetPassword", {
            Email,
            info: (await publicIp.v4()) || "",
        });

    public RegisterUser = (data) => this.instance.post("/RegisterUser", data);

    public GetManagedToken = (params) =>
        this.instance.get("/GetManagedToken", {
            params,
        });

    public ChangePassword = (data) =>
        this.instance.post("/ChangePassword", data);
}

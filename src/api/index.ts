import { message } from "antd";
import axios, { Method, AxiosInstance, AxiosResponse } from "axios";
import { API_APP_URL, API_AUTH_URL } from "../configs/AppConfig";
import { INTERNAL_ERROR } from "../constants/Messages";
import { getProfileInfo } from "../redux/actions/Account";
import { refreshToken } from "../redux/actions/Auth";
import store from "../redux/store";
import { ServerData } from "../types";
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
            if (config.method === "get") {
                config.params = {
                    Token: store.getState().auth.token,
                };
            }
            return config;
        });
    };

    public _handleResponse = ({ data }: AxiosResponse) => {
        if (data.ErrorCode === 0) {
            return data;
        } else if (data.ErrorCode === 118) {
            const token = store.getState().auth.token;
            store.dispatch(refreshToken(token));
        } else {
            throw new Error(INTERNAL_ERROR);
        }
    };
    public _handleError = (error: any) => {
        const key = "updatable";
        message.error({ content: error.toString(), key });
        // return Promise.reject(error);
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

    public RefreshToken = () => this.instance.get("/RefreshToken");
}

export const refreshToken = () => async (dispatch) => {
    return new AuthApi().RefreshToken().then((data) => {
        const { ErrorCode, ErrorMessage, Token } = data;
        dispatch({ type: SET_TOKEN, token: Token });
        window.location.reload();
        if (ErrorCode === 105) {
            const key = "updatable";
            message
                .loading({ content: EXPIRE_TIME, key })
                .then(() => dispatch(signOut()));
        }
    });
};

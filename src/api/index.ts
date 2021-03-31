import { message } from "antd";
import axios, { AxiosInstance, AxiosResponse, CancelTokenSource } from "axios";
import { API_APP_URL, API_AUTH_URL, DOMAIN } from "../configs/AppConfig";
import { AUTHENTICATED, HIDE_LOADING, SIGNOUT } from "../redux/constants/Auth";
import store from "../redux/store";
import TranslateText from "../utils/translate";
import { ApiDecorator, ApiResponse } from "./types";
import Cookies from "js-cookie";

declare module "axios" {
  interface AxiosResponse<T> extends Promise<T> {}
}

class HttpService {
  public readonly instance: AxiosInstance;
  public _token: string | undefined;
  public _source: CancelTokenSource;

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
    this._token = Cookies.get("Token");
    this._source = axios.CancelToken.source();
    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }

  public _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError
    );
  };
  private setToken = (Token: string) => {
    this._token = Token;
    Cookies.set("Token", Token, {
      expires: 1,
      domain: DOMAIN,
      path: "/",
    });
  };
  public _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      (config) => {
        console.log(config);
        /*
         * To avoid passing the Token as a param everytime we wanna make a request,
         * pass it here by default
         */
        return {
          ...config,
          data: { ...config.data, Token: this._token },
          params: { ...config.params, Token: this._token },
          cancelToken: this._source.token,
        };
      },
      (error) => Promise.reject(error)
    );
  };

  private _RefreshToken = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "Token", string>>(
      `${API_AUTH_URL}/RefreshToken`
    );

  private _handleResponse = async (response: AxiosResponse) => {
    console.log(response);
    if (response.data.ErrorCode === 118) {
      return await this._RefreshToken().then(async (data) => {
        if (data && data.ErrorCode === 0) {
          const { Token } = data;
          this.setToken(Token);
          // If the last request was a GET, we pass the Token as param
          if (response.config.method === "get") {
            response.config.params = {
              ...response.config.params,
              Token,
            };
            return await this.instance.request(response.config);
          }

          // If the last request was a POST, we pass the Token inside body
          if (response.config.method === "post") {
            response.config.data = {
              ...JSON.parse(response.config.data),
              Token,
            };
            return await this.instance.request(response.config);
          }
        } else {
          // In case RefreshToken fails, we log out the user
          message
            .loading({
              content: TranslateText("message.ExpireTime"),
              key: "updatable",
              duration: 1.5,
            })
            .then(() => {
              store.dispatch({ type: SIGNOUT });
            });
        }
      });
    } else if (
      // Handle the rest of errors here
      response.data.ErrorCode !== 0 &&
      response.data.ErrorCode !== 108 &&
      response.data.ErrorCode !== 102
    ) {
      message.error({
        content: `Error: ${response.data.ErrorMessage}`,
        key: "updatable",
        duration: 2.5,
      });
    }
    // Always return data by default
    return response.data;
  };

  private _handleError = async (error: AxiosResponse) => {
    // Handle all non 200 requests here
    if (error.request.status !== 200) {
      message.error({
        content: error.toString(),
        key: "updatable",
        duration: 10,
      });
    }
    store.dispatch({ type: HIDE_LOADING });
  };
}
export default HttpService;

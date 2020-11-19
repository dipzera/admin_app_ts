import { message } from "antd";
import axios, { Method, AxiosInstance, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
declare module "axios" {
    interface AxiosResponse<T = any> extends Promise<T> {}
}

class HttpClient {
    public readonly instance: AxiosInstance;

    public constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
        });
        this._initializeResponseInterceptor();
    }

    public _initializeResponseInterceptor = () => {
        this.instance.interceptors.response.use(
            this._handleResponse,
            this._handleError
        );
    };

    public _handleResponse = ({ data }: AxiosResponse) => data;
    public _handleError = (error: any) => Promise.reject(error);
}

export default HttpClient;

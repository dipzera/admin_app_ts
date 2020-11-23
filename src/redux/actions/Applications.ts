import { message } from "antd";
import Axios, { AxiosResponse } from "axios";
import { API_APP_URL } from "../../configs/AppConfig";
import { EXPIRE_TIME } from "../../constants/Messages";
import { IMarketAppList } from "../../types";
import { SET_APPS } from "../constants/Applications";
import { hideLoading, refreshToken, showLoading, signOut } from "./Auth";

const setApps = (payload) => ({
    type: SET_APPS,
    payload,
});

export const getMarketApps = (Token) => async (dispatch) => {
    dispatch(showLoading());
    Axios.get(`${API_APP_URL}/GetMarketAppList`, {
        params: {
            Token,
        },
    })
        .then(({ data }) => {
            dispatch(hideLoading());
            const { ErrorCode, ErrorMessage, MarketAppList } = data;
            if (ErrorCode === 0) {
                dispatch(setApps(MarketAppList));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken());
            } else if (ErrorCode === -1) {
                console.log(ErrorMessage);
                throw new Error("Internal Error");
            }
        })
        .catch((error) => {
            dispatch(hideLoading());
            const key = "updatable";
            message.error({ content: error.toString(), key });
        });
};
export const updateMarketApp = (App, Token) => async (dispatch) => {
    Axios.post(`${API_APP_URL}/UpdateMarketApp`, {
        App,
        Token,
    })
        .then((res) => {
            console.log(res.data);
            const { ErrorCode, ErrorMessage } = res.data;
            if (ErrorCode === 0) {
                dispatch(getMarketApps(Token));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken());
            } else {
                throw new Error(ErrorMessage);
            }
        })
        .catch((error) => {
            const key = "updatable";
            message.error({ content: error.toString(), key });
        });
};

export const createMarketAppPackage = (
    middlewareData,
    MarketAppID,
    Token
) => async (dispatch) => {
    dispatch(showLoading());
    Axios.post(`${API_APP_URL}/CreateMarketAppPackage`, {
        AppPackage: {
            ...middlewareData,
        },
        MarketAppID,
        Token,
    })
        .then((res) => {
            dispatch(hideLoading());
            console.log(res.data);
            const { ErrorCode, ErrorMessage } = res.data;
            if (ErrorCode === 0) {
                dispatch(getMarketApps(Token));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken());
            } else {
                throw new Error(ErrorMessage);
            }
        })
        .catch((error) => {
            const key = "updatable";
            message.error({ content: error.toString(), key });
            dispatch(hideLoading());
        });
};
export const updateMarketAppPackage = (AppPackage, Token) => async (
    dispatch
) => {
    dispatch(showLoading());
    Axios.post(`${API_APP_URL}/UpdateMarketAppPackage`, {
        AppPackage,
        Token,
    })
        .then((res) => {
            dispatch(hideLoading());
            console.log(res.data);
            const { ErrorCode, ErrorMessage } = res.data;
            if (ErrorCode === 0) {
                dispatch(getMarketApps(Token));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken());
            } else {
                throw new Error(ErrorMessage);
            }
        })
        .catch((error) => {
            const key = "updatable";
            message.error({ content: error.toString(), key });
            dispatch(hideLoading());
        });
};

export const deleteMarketAppPackage = (ID, Token) => async (
    dispatch,
    getState
) => {
    dispatch(showLoading());
    Axios.post(`${API_APP_URL}/DeleteMarketAppPackage`, {
        ID,
        Token,
    })
        .then((res) => {
            dispatch(hideLoading());
            console.log(res.data);
            const { ErrorCode, ErrorMessage } = res.data;
            if (ErrorCode === 0) {
                dispatch(getMarketApps(getState()["auth"].token));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken());
                message
                    .loading(EXPIRE_TIME, 1.5)
                    .then(() => dispatch(signOut()));
            } else {
                throw new Error(ErrorMessage);
            }
        })
        .catch((error) => {
            const key = "updatable";
            message.error({ content: error.toString(), key });
            dispatch(hideLoading());
        });
};

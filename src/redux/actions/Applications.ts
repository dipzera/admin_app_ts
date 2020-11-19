import { message } from "antd";
import Axios from "axios";
import { API_APP_URL } from "../../configs/AppConfig";
import { API_IS_APP_SERVICE } from "../../constants/ApiConstant";
import { EXPIRE_TIME } from "../../constants/Messages";
import { SET_APPS } from "../constants/Applications";
import { hideLoading, refreshToken, showLoading, signOut } from "./Auth";

const setApps = (payload) => ({
    type: SET_APPS,
    payload,
});

export const getMarketApps = (Token) => async (dispatch) => {
    dispatch(showLoading());
    Axios.get(`${API_IS_APP_SERVICE}/GetMarketAppList`, {
        params: {
            Token,
        },
    })
        .then((res) => {
            dispatch(hideLoading());
            const { ErrorCode, ErrorMessage, MarketAppList } = res.data;
            console.log(res.data);
            if (ErrorCode === 0) {
                dispatch(setApps(MarketAppList));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken(Token));
            }
        })
        .catch((error) => {
            dispatch(hideLoading());

            const key = "updatable";
            message.error({ content: error.toString(), key });
        });
};
export const updateMarketApp = (App, Token) => async (dispatch) => {
    Axios.post(`${API_IS_APP_SERVICE}/UpdateMarketApp`, {
        App,
        Token,
    })
        .then((res) => {
            console.log(res.data);
            const { ErrorCode, ErrorMessage } = res.data;
            if (ErrorCode === 0) {
                dispatch(getMarketApps(Token));
            } else if (ErrorCode === 118) {
                dispatch(refreshToken(Token));
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
    Axios.post(`${API_IS_APP_SERVICE}/CreateMarketAppPackage`, {
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
                dispatch(refreshToken(Token));
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
    Axios.post(`${API_IS_APP_SERVICE}/UpdateMarketAppPackage`, {
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
                dispatch(refreshToken(Token));
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
    Axios.post(`${API_IS_APP_SERVICE}/DeleteMarketAppPackage`, {
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
                dispatch(refreshToken(Token));
                message
                    .loading(EXPIRE_TIME, 1.5)
                    .then(() => dispatch(signOut()));
            }
        })
        .catch((error) => {
            const key = "updatable";
            message.error({ content: error.toString(), key });
            dispatch(hideLoading());
        });
};

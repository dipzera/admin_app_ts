import {
    SIGNIN,
    AUTHENTICATED,
    SIGNOUT,
    SIGNOUT_SUCCESS,
    SHOW_AUTH_MESSAGE,
    HIDE_AUTH_MESSAGE,
    SIGNUP,
    SIGNUP_SUCCESS,
    SHOW_LOADING,
    SIGNIN_WITH_GOOGLE,
    SIGNIN_WITH_GOOGLE_AUTHENTICATED,
    SIGNIN_WITH_FACEBOOK,
    SIGNIN_WITH_FACEBOOK_AUTHENTICATED,
    HIDE_LOADING,
} from "../constants/Auth";
import { message, Modal } from "antd";
import { IS_USER_ACTIVATED } from "../constants/Auth";
import { getProfileInfo } from "./Account";
import { EMAIL_CONFIRM_MSG, EXPIRE_TIME } from "../../constants/Messages";
import { AuthApi } from "../../api";
import { ThunkResult } from "../reducers";

export const authenticated = (token: string) => ({
    type: AUTHENTICATED,
    token,
});

export const signOut = () => ({
    type: SIGNOUT,
});

export const showAuthMessage = (message: string) => ({
    type: SHOW_AUTH_MESSAGE,
    message,
});

export const hideAuthMessage = () => ({
    type: HIDE_AUTH_MESSAGE,
});

export const showLoading = () => ({
    type: SHOW_LOADING,
});
export const hideLoading = () => ({
    type: HIDE_LOADING,
});

export const refreshToken = (): ThunkResult<void> => async (dispatch) => {
    return new AuthApi().RefreshToken().then(async (data: any) => {
        if (data) {
            const { ErrorCode, ErrorMessage, Token } = data;
            if (ErrorCode === 0) {
                await dispatch(authenticated(Token));
                window.location.reload();
            } else if (ErrorCode === 105) {
                const key = "updatable";
                message
                    .loading({ content: EXPIRE_TIME, key })
                    .then(() => dispatch(signOut()));
            }
        }
    });
};
export const sendActivationCode = (
    UserID?: number
): ThunkResult<void> => async (dispatch) => {
    return new AuthApi().SendActivationCode(UserID).then((data: any) => {
        if (data) {
            const { ErrorMessage, ErrorCode } = data;
            if (ErrorCode === 0) message.success(EMAIL_CONFIRM_MSG);
            else dispatch(showAuthMessage(ErrorMessage));
        }
    });
};
export const authorizeUser = (data: {
    [key: string]: any;
}): ThunkResult<void> => async (dispatch) => {
    return new AuthApi().Login(data).then((data) => {
        dispatch(hideLoading());
        /* Handle errors here */
        if (data) {
            const { ErrorCode, ErrorMessage, Token } = data;
            if (ErrorCode === 0) {
                dispatch(authenticated(Token));
                dispatch(getProfileInfo());
            }
            if (ErrorCode === 102) {
                dispatch(hideLoading());
                dispatch(showAuthMessage(ErrorMessage));
            } else if (ErrorCode === 108) {
                dispatch(hideLoading());
                Modal.confirm({
                    title: "Confirm registration",
                    content:
                        "Press the OK button down below if you want us to send you a new activation code!",
                    onOk: () => {
                        dispatch(sendActivationCode());
                    },
                });
            } else {
                dispatch(hideLoading());
                dispatch(showAuthMessage(ErrorMessage));
            }
        }
    });
};

import {
    AUTHENTICATED,
    SIGNOUT,
    SHOW_AUTH_MESSAGE,
    HIDE_AUTH_MESSAGE,
    SHOW_LOADING,
    HIDE_LOADING,
} from "../constants/Auth";
import { message, Modal } from "antd";
import { getProfileInfo } from "./Account";
import { DONE } from "../../constants/Messages";
import { AuthApi } from "../../api";
import { ThunkResult } from "../reducers";
import WithStringTranslate from "../../utils/translate";
import { IAuthorizeUserRequest } from "../../api/types.request";

type Actions =
    | { type: typeof AUTHENTICATED; token: string }
    | { type: typeof SIGNOUT }
    | { type: typeof SHOW_AUTH_MESSAGE; message: string }
    | { type: typeof HIDE_AUTH_MESSAGE }
    | { type: typeof SHOW_LOADING }
    | { type: typeof HIDE_LOADING };

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

export const sendActivationCode = (
    UserID?: number
): ThunkResult<void> => async (dispatch) => {
    return new AuthApi().SendActivationCode(UserID).then((data) => {
        if (data) {
            const { ErrorMessage, ErrorCode } = data;
            if (ErrorCode === 0)
                message.success({
                    content: WithStringTranslate(DONE),
                    key: "updatable",
                    duration: 2,
                });
            else dispatch(showAuthMessage(ErrorMessage ?? "Error"));
        }
    });
};

export const authorizeUser = (
    serverData: IAuthorizeUserRequest
): ThunkResult<void> => async (dispatch) => {
    return new AuthApi().Login(serverData).then((data) => {
        dispatch(hideLoading());
        /* Handle errors here */
        if (data) {
            const { ErrorCode, ErrorMessage, Token } = data;
            if (ErrorCode === 0) {
                dispatch(authenticated(Token ?? ""));
                dispatch(getProfileInfo());
            }
            if (ErrorCode === 102) {
                dispatch(hideLoading());
                dispatch(showAuthMessage(ErrorMessage ?? "Error"));
            } else if (ErrorCode === 108) {
                dispatch(hideLoading());
                Modal.confirm({
                    title: WithStringTranslate(
                        "auth.ConfirmRegistration.Title"
                    ),
                    content: WithStringTranslate(
                        "auth.ConfirmRegistration.Content"
                    ),
                    onOk: () => {
                        dispatch(sendActivationCode());
                    },
                });
            } else {
                dispatch(hideLoading());
                dispatch(showAuthMessage(ErrorMessage ?? "Error"));
            }
        }
    });
};

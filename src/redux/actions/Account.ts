import {
    API_IS_AUTH_SERVICE,
    API_IS_APP_SERVICE,
} from "../../constants/ApiConstant";
import { REMOVE_AVATAR, UPDATE_SETTINGS } from "../constants/Account";
import axios from "axios";
import { message } from "antd";
import { onLocaleChange } from "./Theme";
import { hideLoading, showLoading, signOut } from "./Auth";
import { DONE, EXPIRE_TIME, LOADING } from "../../constants/Messages";

export const updateSettings = (payload) => ({
    type: UPDATE_SETTINGS,
    payload,
});

export const getProfileInfo = (Token) => {
    return async (dispatch) => {
        axios
            .get(`${API_IS_APP_SERVICE}/GetProfileInfo`, {
                params: {
                    Token,
                },
            })
            .then((res) => {
                const { User, ErrorCode, ErrorMessage } = res.data;
                console.log(res.data);
                if (ErrorCode === 0) {
                    dispatch(updateSettings(User));
                    if (User.UiLanguage === 0) {
                        dispatch(onLocaleChange("ro"));
                    } else if (User.UiLanguage === 1) {
                        dispatch(onLocaleChange("ru"));
                    } else {
                        dispatch(onLocaleChange("en"));
                    }
                } else {
                    message.loading(
                        "Time has expired. Redirecting you to login page...",
                        1.5
                    );
                    setTimeout(() => {
                        dispatch(signOut());
                    }, 1500);
                }
            });
    };
};
export const setProfileInfo = (accountInfo) => {
    return async (dispatch) => {
        axios
            .post(`${API_IS_APP_SERVICE}/UpdateUser`, accountInfo)
            .then((res) => {
                if (res.data.ErrorCode === 0) {
                    const { User } = accountInfo;
                    dispatch(updateSettings(User));
                } else if (res.data.ErrorCode === 118) {
                    message.loading(
                        "Time has expired. Redirecting you to login page...",
                        1.5
                    );
                    setTimeout(() => {
                        signOut();
                    }, 1500);
                }
            });
    };
};

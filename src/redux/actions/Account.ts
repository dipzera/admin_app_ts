import { CLEAR_SETTINGS, UPDATE_SETTINGS } from "../constants/Account";
import { message } from "antd";
import { onLocaleChange } from "./Theme";
import { DONE } from "../../constants/Messages";
import { AdminApi } from "../../api";
import { ThunkResult } from "../reducers";
import { IUpdateUserRequest } from "../../api/types.request";

export const updateSettings = (payload: { [key: string]: any }) => ({
    type: UPDATE_SETTINGS,
    payload,
});

export const clearSettings = () => ({
    type: CLEAR_SETTINGS,
});

export const getProfileInfo = (): ThunkResult<void> => {
    return async (dispatch) => {
        return new AdminApi().GetProfileInfo().then((data: any) => {
            if (data) {
                const { ErrorCode, ErrroMessage, User } = data;
                if (ErrorCode === 0) {
                    dispatch(updateSettings(data.User));
                    if (User.UiLanguage === 0) {
                        dispatch(onLocaleChange("ro"));
                    } else if (User.UiLanguage === 1) {
                        dispatch(onLocaleChange("ru"));
                    } else {
                        dispatch(onLocaleChange("en"));
                    }
                }
            }
        });
    };
};
export const setProfileInfo = (
    accountInfo: IUpdateUserRequest
): ThunkResult<void> => {
    return async (dispatch) => {
        return new AdminApi().UpdateUser(accountInfo).then((data) => {
            if (data) {
                if (data.ErrorCode === 0) {
                    dispatch(getProfileInfo());
                }
            }
        });
    };
};

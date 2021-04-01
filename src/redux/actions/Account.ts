import { CLEAR_SETTINGS, UPDATE_SETTINGS } from "../constants/Account";
import { message } from "antd";
import { onHeaderNavColorChange, onLocaleChange } from "./Theme";
import { AppService } from "../../api/app";
import { ThunkResult } from "../reducers";
import { IAccount } from "../reducers/Account";
import TranslateText from "../../utils/translate";
import { DONE } from "../../constants/Messages";
import { AuthService } from "../../api/auth";

export const updateSettings = (payload: { [key: string]: any }) => ({
  type: UPDATE_SETTINGS,
  payload,
});

export const clearSettings = () => ({
  type: CLEAR_SETTINGS,
});

export const getProfileInfo = (): ThunkResult<void> => {
  return async (dispatch) => {
    return new AuthService().GetProfileInfo().then((data: any) => {
      if (data) {
        const { ErrorCode, ErrroMessage, User } = data;
        if (ErrorCode === 0) {
          dispatch(updateSettings(data.User));
          if (window.location.origin.includes("test"))
            dispatch(onHeaderNavColorChange("#DE4436"));

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
export const setProfileInfo = (accountInfo: IAccount): ThunkResult<void> => {
  return async (dispatch) => {
    return new AppService().UpdateUser(accountInfo).then((data) => {
      if (data && data.ErrorCode === 0) {
        dispatch(getProfileInfo());
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
          duration: 1,
        });
      }
    });
  };
};

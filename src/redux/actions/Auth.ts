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
import { AuthService } from "../../api/auth";
import { ThunkResult } from "../reducers";
import TranslateText from "../../utils/translate";
import { DOMAIN, SUBDIR_PATH } from "../../configs/AppConfig";
import { onHeaderNavColorChange } from "./Theme";
import { EXPIRE_DAYS } from "../../constants/ApiConstant";
import Cookies from "js-cookie";

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
  return await new AuthService().SendActivationCode(UserID).then((data) => {
    if (data) {
      const { ErrorMessage, ErrorCode } = data;
      if (ErrorCode === 0)
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
          duration: 2,
        });
      else dispatch(showAuthMessage(ErrorMessage ?? "Error"));
    }
  });
};

export const authorizeUser = (
  email: string,
  password: string
): ThunkResult<void> => async (dispatch) => {
  return new AuthService()
    .Login(email, password)
    .then((data) => {
      dispatch(hideLoading());
      /* Handle errors here */
      if (data) {
        const { ErrorCode, ErrorMessage, Token } = data;
        if (ErrorCode === 0) {
          Cookies.set("Token", Token, {
            expires: EXPIRE_DAYS,
            domain: DOMAIN,
            path: "/",
          });

          return data;
        } else if (ErrorCode === 102) {
          dispatch(hideLoading());
          dispatch(showAuthMessage(ErrorMessage ?? "Error"));
          return data;
        } else if (ErrorCode === 108) {
          dispatch(hideLoading());
          Modal.confirm({
            title: TranslateText("auth.ConfirmRegistration.Title"),
            content: TranslateText("auth.ConfirmRegistration.Content"),
            onOk: () => {
              dispatch(sendActivationCode());
            },
          });
          return data;
        } else {
          dispatch(hideLoading());
          dispatch(showAuthMessage(ErrorMessage ?? "Error"));
          return data;
        }
      }
    })
    .then((data) => {
      dispatch(hideLoading());
      return data;
    });
};

import React from "react";
import Localization from "../utils/Localization";

export const ACTIVATION_MSG_TITLE = "User registration confirmation";
export const ACTIVATION_MSG_CONTENT =
    "Press OK if you want us to send a new activation message";
export const EXPIRE_TIME = () => {
    return <Localization msg="message.ExpireTime" />;
};
export const EMAIL_CONFIRM_MSG_2 =
    "Please confirm the registration by clicking on the link we've sent to your email!";
export const EMAIL_CONFIRM_MSG = "Confirmation message was send to the email!";
export const ACTIVATE_ACCOUNT =
    "Your account is not activated. Press the OK button down below if you want us to send you a new confirmation message.";
export const DELETE_PACKAGE_MSG = (ID: number) =>
    `Are you sure you want to delete package with id: ${ID}`;
export const DONE = "message.Done";
export const UPLOADED = "message.Uploaded";
export const UPLOADING = "message.Uploading";
export const INTERNAL_ERROR = "Internal Error";
export const LOADING = "message.Loading";
export const UPDATING = "message.Updating";
export const ERROR = "message.Error";
export const PASSWORD_SENT = "New password has been sent to your email!";

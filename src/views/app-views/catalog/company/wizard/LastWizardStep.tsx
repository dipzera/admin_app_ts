import { message } from "antd";
import Axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_APP_URL, API_AUTH_URL } from "../../../../../configs/AppConfig";
import { refreshToken } from "../../../../../redux/actions/Auth";
import { WizardContext } from "./WizardContext";

const LastWizardStep = () => {
    const context = React.useContext(WizardContext);
    const dispatch = useDispatch();
    const Token = useSelector((state) => state["auth"].token);
    /* Above might be stored inside the Wizard Context */

    const handleCompanyRegister = (): any => {
        return Axios.post(`${API_APP_URL}/RegisterClientCompany`, {
            ...context.wizardData.CompanyData,
        }).then((response) => {
            return response.data;
        });
    };
    const handleUserRegister = (CompanyID) => {
        return Axios.post(`${API_AUTH_URL}/RegisterUser`, {
            ...context.wizardData.UserData,
            Token,
            CompanyID,
            UiLanguage: 0,
        }).then((response) => {
            return response.data;
        });
    };
    useEffect(() => {
        message.loading("Proceeding to send data...", 1.5).then(async () => {
            if (context.apiSuccess) {
                await handleUserRegister(context.companyID)
                    .then((data) => {
                        if (data.ErrorCode === 0) {
                            message.success("Successful registration!");
                        } else {
                            throw data.ErrorMessage;
                        }
                    })
                    .catch((err) => {
                        message.error(err.toString());
                        context.setCurrent(context.current - 1);
                    });
            } else {
                await handleCompanyRegister()
                    .then((result) => {
                        if (result.ErrorCode === 0) {
                            context.setApiSuccess(true);
                            context.setCompanyID(+result.CompanyID);
                            return result.CompanyID;
                        } else {
                            throw result.ErrorMessage;
                        }
                    }) /* Maybe place an if statement below */
                    .then((CompanyID) => {
                        message
                            .loading("Proceeding to send user data...", 1.5)
                            .then(async () => {
                                await handleUserRegister(CompanyID)
                                    .then((result) => {
                                        if (result.ErrorCode === 0) {
                                            message.success(
                                                "Successful registration!"
                                            );
                                        } else {
                                            throw result.ErrorMessage;
                                        }
                                    })
                                    .catch((err) => {
                                        message.error(err.toString());
                                        context.setCurrent(context.current - 1);
                                    });
                            });
                    })
                    .catch((err) => {
                        message.error(err.toString());
                        context.setCurrent(context.current - 2);
                    });
            }
        });
    }, []);
    return <div>This is last wizard step, congratulations</div>;
};

export default LastWizardStep;

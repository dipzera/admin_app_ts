import { message } from "antd";
import Axios, { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    API_IS_APP_SERVICE,
    API_IS_AUTH_SERVICE,
} from "../../../../../constants/ApiConstant";
import { refreshToken } from "../../../../../redux/actions/Auth";
import { WizardContext } from "./WizardContext";

const LastWizardStep = () => {
    const context = React.useContext(WizardContext);
    const dispatch = useDispatch();
    const Token = useSelector((state) => state["auth"].token);
    /* Above might be stored inside the Wizard Context */
    const [companyApiSuccess, setCompanyApiSuccess] = useState(false);

    const handleCompanyRegister = (): any => {
        return Axios.post(`${API_IS_APP_SERVICE}/RegisterClientCompany`, {
            ...context.wizardData.CompanyData,
        }).then((response) => response.data);
    };
    const handleUserRegister = (CompanyID) => {
        return Axios.post(`${API_IS_AUTH_SERVICE}/RegisterUser`, {
            ...context.wizardData.UserData,
            Token,
            CompanyID,
        }).then((response) => {
            return response.data;
        });
    };
    useEffect(() => {
        message.loading("Proceeding to send data...", 1.5).then((resolve) => {
            if (companyApiSuccess) {
                handleUserRegister(context.CompanyID);
            } else {
                handleCompanyRegister()
                    .then((result) => {
                        if (result.ErrorCode === 0) {
                            return result.CompanyID;
                        } else {
                            message.error(result.ErrorMessage);
                            context.setCurrent(context.current - 2);
                        }
                    }) /* Maybe place an if statement below */
                    .then((CompanyID) =>
                        message
                            .loading("Proceeding to send user data...", 1.5)
                            .then(() => {
                                handleUserRegister(CompanyID).then((result) => {
                                    if (result.ErrorCode === 0) {
                                        message.success(
                                            "Hooray! You've registered"
                                        );
                                    } else {
                                        message.error(result.ErrorMessage);
                                        context.setCurrent(context.current - 1);
                                    }
                                });
                            })
                    );
            }
        });
        console.log(context);
    }, []);
    return <div>This is last wizard step, congratulations</div>;
};

export default LastWizardStep;

import { message } from "antd";
import Axios from "axios";
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

    const handleCompanyRegister = () => {
        Axios.post(`${API_IS_APP_SERVICE}/RegisterClientCompany`, {
            ...context.wizardData.CompanyData,
        }).then((response) => {
            console.log(response.data);
            const { ErrorCode, ErrorMessage, CompanyID } = response.data;
            if (ErrorCode === 0) {
                setCompanyApiSuccess(true);
                return CompanyID;
                // Show success message, save in STATE that RegisterClientCompany has succeeded, then proceed to call RegisterUser API Function
            } else if (ErrorCode === 118) {
                dispatch(refreshToken(Token));
            } else {
                setCompanyApiSuccess(false);
            }
        });
    };
    const handleUserRegister = (CompanyID) => {
        Axios.post(`${API_IS_AUTH_SERVICE}/RegisterUser`, {
            ...context.wizardData.UserData,
            Token,
            CompanyID,
        }).then((res) => {
            const { ErrorCode, ErrorMessage } = res.data;
            if (ErrorCode === 0) {
                /* Everything is fine, proceed to show the user that he has successfully completed the wizard forms and he is free to do whatever he wants further  */
            } else if (ErrorCode === 118) {
                dispatch(refreshToken(Token));
            }
        });
    };
    useEffect(() => {
        /* Render loader and then proceed to call RegisterClientCompany API function  */
        if (companyApiSuccess) {
        }
        message
            .loading("Proceeding to send company data...", 1.5)
            .then(() => {
                const CompanyID = handleCompanyRegister();
                return CompanyID;
            })
            .then((CompanyID) => {
                if (companyApiSuccess) {
                    handleUserRegister(CompanyID);
                }
            });
        console.log(context);
    }, []);
    return <div>This is last wizard step, congratulations</div>;
};

export default LastWizardStep;

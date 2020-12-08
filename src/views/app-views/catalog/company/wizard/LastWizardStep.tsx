import { message } from "antd";
import React, { useEffect } from "react";
import { AdminApi, AuthApi } from "../../../../../api";
import { WizardContext } from "./WizardContext";

const LastWizardStep = () => {
    const context = React.useContext(WizardContext);

    const handleCompanyRegister = (): any => {
        return new AdminApi()
            .RegisterClientCompany({ ...context.wizardData.CompanyData })
            .then((data: any) => data);
    };
    const handleUserRegister = (CompanyID: number) => {
        return new AuthApi()
            .RegisterUser({ ...context.wizardData.UserData, CompanyID })
            .then((data) => data);
    };
    useEffect(() => {
        message.loading("Proceeding to send data...", 1.5).then(async () => {
            if (context.apiSuccess) {
                await handleUserRegister(context.companyID)
                    .then((data) => {
                        if (data) {
                            if (data.ErrorCode === 0) {
                                message.success("Successful registration!");
                            } else {
                                throw data.ErrorMessage;
                            }
                        }
                    })
                    .catch((err) => {
                        // message.error(err.toString());
                        context.setCurrent(context.current - 1);
                    });
            } else {
                await handleCompanyRegister()
                    .then((result: any): number => {
                        if (result.ErrorCode === 0) {
                            context.setApiSuccess(true);
                            context.setCompanyID(+result.CompanyID);
                            return result.CompanyID;
                        } else {
                            throw result.ErrorMessage;
                        }
                    }) /* Maybe place an if statement below */
                    .then((CompanyID: number) => {
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
                                    .catch(() => {
                                        context.setCurrent(context.current - 1);
                                    });
                            });
                    })
                    .catch(() => {
                        context.setCurrent(context.current - 2);
                    });
            }
        });
    }, []);
    return <div>This is last wizard step, congratulations</div>;
};

export default LastWizardStep;

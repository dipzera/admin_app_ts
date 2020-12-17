import { message } from "antd";
import React, { useEffect, useState } from "react";
import { AdminApi, AuthApi } from "../../../../../api";
import Flex from "../../../../../components/shared-components/Flex";
import Loading from "../../../../../components/shared-components/Loading";
import { IWizard, WizardContext } from "./WizardContext";

const LastWizardStep = () => {
    const context = React.useContext<Partial<IWizard>>(WizardContext);

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log(context);
    }, []);
    const handleCompanyRegister = () => {
        return new AdminApi().RegisterClientCompany({
            ...context.wizardData!.CompanyData,
        });
    };
    const handleUserRegister = (CompanyID?: number) => {
        return new AuthApi().RegisterUser({
            ...context.wizardData!.UserData,
            CompanyID,
        });
    };
    useEffect(() => {
        message.loading("Proceeding to send data...", 1.5).then(async () => {
            if (context.apiSuccess) {
                await handleUserRegister(context.companyID ?? 0)
                    .then((data) => {
                        if (data) {
                            if (data.ErrorCode === 0) {
                                setLoading(false);
                            } else {
                                throw data.ErrorMessage!.toString();
                            }
                        }
                    })
                    .catch(() => {
                        // message.error(err.toString());
                        context.setCurrent!(context.current! - 1);
                    });
            } else {
                await handleCompanyRegister()
                    .then((result): number => {
                        if (result.ErrorCode === 0) {
                            context.setApiSuccess!(true);
                            context.setCompanyID!(+result.CompanyID);
                            return result.CompanyID;
                        } else {
                            throw result.ErrorMessage!.toString();
                        }
                    }) /* Maybe place an if statement below */
                    .then((CompanyID: number) => {
                        message
                            .loading("Proceeding to send user data...", 1.5)
                            .then(async () => {
                                await handleUserRegister(CompanyID)
                                    .then((result) => {
                                        if (result.ErrorCode === 0) {
                                            setLoading(false);
                                        } else {
                                            throw result.ErrorMessage!.toString();
                                        }
                                    })
                                    .catch(() => {
                                        context.setCurrent!(
                                            context.current! - 1
                                        );
                                    });
                            });
                    })
                    .catch(() => {
                        context.setCurrent!(context.current! - 2);
                    });
            }
        });
    }, []);
    return (
        <>
            {loading ? (
                <Loading cover="content" />
            ) : (
                <Flex justifyContent="center" alignItems="center">
                    <div style={{ textAlign: "center" }}>
                        <div className="mb-6">
                            <img
                                width="150"
                                src={`${process.env.PUBLIC_URL}/img/check.svg`}
                            />
                        </div>
                        <h3>Registration Succeeded</h3>
                        <p>The user has been successfully registered</p>
                    </div>
                </Flex>
            )}
        </>
    );
};

export default LastWizardStep;

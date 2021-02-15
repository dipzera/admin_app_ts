import { Button, message, Result } from "antd";
import React, { useEffect, useState } from "react";
import { AuthService } from "../../../../../api/auth";
import { AppService } from "../../../../../api/app";
import Flex from "../../../../../components/shared-components/Flex";
import Loading from "../../../../../components/shared-components/Loading";
import { IWizard, WizardContext } from "./WizardContext";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";

const LastWizardStep = () => {
  const context = React.useContext<Partial<IWizard>>(WizardContext);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(context);
  }, []);
  const handleCompanyRegister = () => {
    return new AppService().RegisterClientCompany({
      ...context.wizardData!.CompanyData,
    });
  };
  const handleUserRegister = (CompanyID?: number) => {
    return new AuthService().RegisterUser({
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
                    context.setCurrent!(context.current! - 1);
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
        <Result
          title="Registration Succeeded"
          subTitle="The user has been successfully registered"
          status="success"
          extra={
            <Button type="primary">
              <Link to={`${APP_PREFIX_PATH}/catalog/companies`}>
                Go to companies
              </Link>
            </Button>
          }
        />
      )}
    </>
  );
};

export default LastWizardStep;

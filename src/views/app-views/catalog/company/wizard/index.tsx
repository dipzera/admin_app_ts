import React, { useState } from "react";
import { Steps } from "antd";
import CompanyFormWizard from "./CompanyFormWizard";
import UserFormWizard from "./UserFormWizard";
import { IWizard, WizardContext } from "./WizardContext";
import { useBeforeunload } from "react-beforeunload";
import LastWizardStep from "./LastWizardStep";
import TranslateText from "../../../../../utils/translate";
const steps = [
  {
    title: TranslateText("wizard.Company.title"),
    content: <CompanyFormWizard />,
  },
  {
    title: TranslateText("wizard.User.title"),
    content: <UserFormWizard />,
  },
  {
    title: TranslateText("wizard.Finish.title"),
    content: <LastWizardStep />,
  },
];
const RegisterWizard = () => {
  const { Step } = Steps;

  const [wizardData, setWizardData] = useState<Partial<IWizard["wizardData"]>>(
    {}
  );
  const [current, setCurrent] = useState<number>(0);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);
  const [companyID, setCompanyID] = useState<number>(0);

  useBeforeunload((e: BeforeUnloadEvent) => e.preventDefault());

  return (
    <WizardContext.Provider
      value={{
        wizardData,
        setWizardData,
        current,
        setCurrent,
        apiSuccess,
        setApiSuccess,
        companyID,
        setCompanyID,
      }}
    >
      <div>
        <div className="mt-3">
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content mt-5">{steps[current]["content"]}</div>
          <div className="steps-action"></div>
        </div>
      </div>
    </WizardContext.Provider>
  );
};

export default RegisterWizard;

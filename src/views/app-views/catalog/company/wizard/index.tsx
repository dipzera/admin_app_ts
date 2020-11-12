import { Button, Form, message, Steps } from "antd";
import React, { useState } from "react";
import { PageHeaderAlt } from "../../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../../components/shared-components/Flex";
import CompanyFormWizard from "./CompanyFormWizard";
import UserFormWizard from "./UserFormWizard";
import { WizardContext } from "./WizardContext";
const steps = [
    {
        title: "Company info",
        content: <CompanyFormWizard />,
    },
    {
        title: "User info",
        content: <UserFormWizard />,
    },
    {
        title: "Finish",
        content: "Last content",
    },
];
const RegisterWizard = () => {
    const { Step } = Steps;

    const [wizardData, setWizardData] = useState({
        CompanyData: {},
        UserData: {},
    });
    const [current, setCurrent] = useState<any>(0);
    function next() {
        setCurrent(current + 1);
    }
    function prev() {
        setCurrent(current - 1);
    }

    window.onbeforeunload = function (e) {
        return e;
    };

    return (
        <WizardContext.Provider
            value={{ wizardData, setWizardData, current, setCurrent }}
        >
            <div>
                <PageHeaderAlt className="bg-white border-bottom">
                    <div className="container-fluid">
                        <Flex
                            justifyContent="between"
                            alignItems="center"
                            className="py-4 "
                        >
                            <h2>Registration wizard</h2>
                        </Flex>
                    </div>
                </PageHeaderAlt>
                <div className="mt-3">
                    <Steps current={current}>
                        {steps.map((item) => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                    <div className="steps-content mt-4">
                        {steps[current]["content"]}
                    </div>
                    <div className="steps-action">
                        {/* {current < steps.length - 1 && (
                            <Button
                                htmlType="submit"
                                type="primary"
                                onClick={() => next()}
                            >
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button
                                type="primary"
                                onClick={() =>
                                    message.success("Processing complete!")
                                }
                            >
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button
                                style={{ marginLeft: 8 }}
                                onClick={() => prev()}
                            >
                                Previous
                            </Button>
                        )} */}
                    </div>
                </div>
            </div>
        </WizardContext.Provider>
    );
};

export default RegisterWizard;

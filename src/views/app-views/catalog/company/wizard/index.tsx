import { Button, message, Steps } from "antd";
import React, { useState } from "react";
import { PageHeaderAlt } from "../../../../../components/layout-components/PageHeaderAlt";
import Flex from "../../../../../components/shared-components/Flex";
import CompanyFormWizard from "./CompanyFormWizard";
import UserFormWizard from "./UserFormWizard";
const steps = [
    {
        title: "Company info",
        content: <CompanyFormWizard />,
    },
    {
        title: "User info",
        content: "User content",
    },
    {
        title: "Finish",
        content: "Last content",
    },
];
const RegisterWizard = () => {
    const { Step } = Steps;
    const [current, setCurrent] = useState<any>(0);
    function next() {
        setCurrent(current + 1);
    }
    function prev() {
        setCurrent(current - 1);
    }
    return (
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
                    {/* <Step title={"Company Info"}>
                        <CompanyFormWizard />
                    </Step>
                    <Step title="User Info">
                        <UserFormWizard />
                    </Step>
                    <Step title="Finish">Finish content</Step> */}
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                {/* Current content of wizard step */}
                <div className="steps-content mt-3">
                    {steps[current]["content"]}
                </div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => next()}>
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
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterWizard;

import { Button, Col, Form, Input, message, Row } from "antd";
import React from "react";
import { UPDATING } from "../../../../../constants/Messages";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import { WizardContext } from "./WizardContext";

class UserFormWizard extends React.Component {
    formRef = React.createRef() as any;
    static contextType = WizardContext;
    render() {
        const onFinish = async (values) => {
            this.context.setWizardData({
                ...this.context.wizardData,
                UserData: { ...values },
            });

            this.context.setCurrent(this.context.current + 1);
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Failed", errorInfo);
        };
        return (
            <>
                <div>
                    <Form
                        name="basicInformation"
                        layout="vertical"
                        initialValues={this.context.wizardData.UserData}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={10}>
                                <Row gutter={ROW_GUTTER}>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={"First Name"}
                                            name="FirstName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input first name",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={"Last Name"}
                                            name="LastName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Please input last name",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item
                                            label={"Email"}
                                            name="Email"
                                            rules={[
                                                {
                                                    required: true,
                                                    type: "email",
                                                    message:
                                                        "Please input email",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                        >
                                            Next
                                        </Button>
                                        <Button
                                            className="ml-2"
                                            onClick={() =>
                                                this.context.setCurrent(
                                                    this.context.current - 1
                                                )
                                            }
                                        >
                                            Previous
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </>
        );
    }
}
export default UserFormWizard;

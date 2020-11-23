import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Row, Col, Tooltip, Form, Modal, Button, message } from "antd";
import {
    CreditCardOutlined,
    CalendarOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import AppLocale from "../../../../lang";
import { DONE, EXPIRE_TIME } from "../../../../constants/Messages";
import { API_APP_URL } from "../../../../configs/AppConfig";
import { AdminApi } from "../../../../api";
export const UserModalEdit = ({
    signOut,
    data,
    visible,
    onCancel,
    locale,
    token,
    getUsersInfo,
}) => {
    const [form] = Form.useForm();

    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const currentAppLocale = AppLocale[locale];
    const onFinish = (values) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            new AdminApi()
                .UpdateUser({
                    User: { ...data, ...values },
                    Token: token,
                })
                .then((data: any) => {
                    data.ErrorCode === 0 && getUsersInfo();
                });
        }, 1000);
    };

    const onFinishFailed = () => {};

    const onOk = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            form.validateFields()
                .then((values) => {
                    onCancel();
                    onFinish(values);
                })
                .catch((info) => {
                    console.log("Validate Failed:", info);
                });
        }, 1000);
    };
    return (
        <Modal
            destroyOnClose
            title={"Edit user"}
            visible={visible}
            okText={<IntlMessage id={"account.EditProfile.SaveChange"} />}
            onCancel={onCancel}
            confirmLoading={isLoading}
            onOk={onOk}
        >
            <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={data}
            >
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.FirstName"}
                                />
                            }
                            name="FirstName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your first name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.LastName"}
                                />
                            }
                            name="LastName"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your last name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage id={"account.EditProfile.Email"} />
                            }
                            name="Email"
                            rules={[
                                {
                                    required: true,
                                    type: "email",
                                    message: "Please enter a valid email!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.EditProfile.PhoneNumber"}
                                />
                            }
                            name="PhoneNumber"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

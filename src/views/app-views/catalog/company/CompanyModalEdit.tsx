import React, { useEffect, useState } from "react";
import { Input, Row, Col, Tooltip, Form, Modal, Button, message } from "antd";
import MaskedInput from "antd-mask-input";
import {
    CreditCardOutlined,
    CalendarOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import AppLocale from "../../../../lang";
import { IntlProvider } from "react-intl";
import { useDispatch } from "react-redux";
import { setProfileInfo } from "../../../../redux/actions/Account";
import axios from "axios";
import { API_IS_APP_SERVICE } from "../../../../constants/ApiConstant";
import { DONE, ERROR, EXPIRE_TIME } from "../../../../constants/Messages";
const publicIp = require("react-public-ip");

export const CompanyModalEdit = ({
    data,
    visible,
    onCancel,
    locale,
    token,
    signOut,
}) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const [mask, setMask] = useState<any>();
    /*  Destroy initialValues of form after Modal is closed */
    useEffect(() => {
        if (!visible) return;
        form.resetFields();
    }, [visible, form]);

    const onChangeMask = (e) => {
        setMask({ [e.target.name]: e.target.value });
    };

    const currentAppLocale = AppLocale[locale];
    const onFinish = (values) => {
        const key = "updatable";
        message.loading({
            content: (
                <IntlProvider
                    locale={currentAppLocale.locale}
                    messages={currentAppLocale.messages}
                >
                    <IntlMessage id={"message.AccountSettings.Updating"} />
                </IntlProvider>
            ),
            key,
        });
        setTimeout(async () => {
            console.log({
                Company: { ...data, ...values },
                Token: token,
                info: await publicIp.v4(),
            });
            axios
                .post(`${API_IS_APP_SERVICE}/UpdateCompany`, {
                    Company: {
                        ...data,
                        ...values,
                    },
                    Token: token,
                    info: (await publicIp.v4()) || "",
                })
                .then((res) => {
                    console.log(res.data);
                    if (res.data.ErrorCode === 0) {
                        message.success(DONE, 1.5);
                        window.location.reload();
                    } else if (res.data.ErrorCode === 118) {
                        message.loading(EXPIRE_TIME, 1.5);
                        setTimeout(() => {
                            signOut();
                        }, 1500);
                    } else {
                        message.error(ERROR, 2);
                    }
                });
        }, 1000);
    };
    const onFinishFailed = () => {};

    return (
        <Modal
            destroyOnClose
            title={"Edit company"}
            style={{ top: "0" }}
            visible={visible}
            okText={<IntlMessage id={"account.EditProfile.SaveChange"} />}
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        onCancel();
                        onFinish(values);
                    })
                    .catch((info) => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form
                form={form}
                name="basicInformation"
                layout="vertical"
                initialValues={data}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Row gutter={ROW_GUTTER}>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={<IntlMessage id={"account.company.BIC"} />}
                            name="BIC"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your BIC!",
                                },
                                {
                                    pattern: /[A-Z]{4}-[A-Z]{2}-[0-9]{5}/,
                                    message: "Invalid BIC format",
                                },
                            ]}
                        >
                            <MaskedInput
                                mask="AAAA-AA-11111"
                                onChange={onChangeMask}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={<IntlMessage id={"account.company.Bank"} />}
                            name="Bank"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your bank!",
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
                                    id={"account.company.CommercialName"}
                                />
                            }
                            name="CommercialName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your commercial name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={<IntlMessage id={"account.company.IBAN"} />}
                            name="IBAN"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your IBAN!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={<IntlMessage id={"account.company.IDNO"} />}
                            name="IDNO"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <IntlMessage
                                            id={"auth.MessageInsertIDNO"}
                                        />
                                    ),
                                },
                                {
                                    pattern: /^(\d{13})?$/,
                                    message: (
                                        <IntlMessage
                                            id={"auth.IDNOValidation"}
                                        />
                                    ),
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
                                    id={"account.company.JuridicalAddress"}
                                />
                            }
                            name="JuridicalAddress"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your juridical address!",
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
                                    id={"account.company.JuridicalName"}
                                />
                            }
                            name="JuridicalName"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your juridical name!",
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
                                    id={"account.company.PhoneNumber"}
                                />
                            }
                            name="PhoneNumber"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your phone number!",
                                },
                                {
                                    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                                    message: "Invalid phone format!",
                                },
                            ]}
                        >
                            <MaskedInput
                                mask="+(111) 111 111 11"
                                onChange={onChangeMask}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage
                                    id={"account.company.OfficeAddress"}
                                />
                            }
                            name="OfficeAddress"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please input your office address!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12}>
                        <Form.Item
                            label={
                                <IntlMessage id={"account.company.VATCode"} />
                            }
                            name="VATCode"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your VAT code!",
                                },
                                {
                                    pattern: /^[0-9]+$/,
                                    message: "Invalid VAT code format!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

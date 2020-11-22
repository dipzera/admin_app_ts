import { Row, Col, Input, Modal, Form, message } from "antd";
import React, { useState } from "react";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import axios from "axios";
import { MaskedInput } from "antd-mask-input";
import utils from "../../../../utils";
import { useDispatch } from "react-redux";
import { refreshToken } from "../../../../redux/actions/Auth";
import { CompanyList, ReduxStoreProps } from "./CompanyList";
import { API_APP_URL } from "../../../../configs/AppConfig";
const publicIp = require("react-public-ip");
export const CompanyModalAdd = ({
    onCreate,
    onCancel,
    visible,
    token: Token,
    CompanyID,
    signOut,
    getCompanyList,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [mask, setMask] = useState<any>();
    const onChangeMask = (e) => {
        setMask({ [e.target.name]: e.target.value });
    };
    const dispatch = useDispatch();
    const onFinish = async (values) => {
        // const ValidFrom = moment(ValidDate[0]["_d"]).format("[/Date(]xZZ[))/]");
        /*  EDIT ABOVE WHEN REGISTER COMPANY FUNCTION IS READY */
        console.log({
            Company: { ...values },
            Token,
            info: await publicIp.v4(),
        });
        axios
            .post(`${API_APP_URL}/RegisterClientCompany`, {
                /* Get the companyID, token and uilanguage from redux store */
                Company: {
                    ...values,
                },
                Token,
                info: (await publicIp.v4()) || "",
            })
            .then((res) => {
                console.log(res.data);
                form.resetFields();
                if (res.data.ErrorCode === 0) {
                    getCompanyList();
                } else if (res.data.ErrorCode === 118) {
                    dispatch(refreshToken(Token));
                } else {
                    throw new Error(res.data.ErrorMessage);
                }
            })
            .catch((error) => {
                const key = "updatable";
                message.error({ content: error, key });
            });
    };
    return (
        /* The component above doesn't work just yet */
        <Modal
            title={"Register company"}
            visible={visible}
            okText={<IntlMessage id={"account.EditProfile.SaveChange"} />}
            onCancel={onCancel}
            confirmLoading={loading}
            onOk={() => {
                setLoading(true);
                setTimeout(() => {
                    setLoading(false);
                    form.validateFields()
                        .then((values) => {
                            onCancel();
                            onFinish(values);
                        })
                        .catch((info) => {
                            console.log("Validate Failed:", info);
                        });
                }, 1000);
            }}
        >
            <Form form={form} name="basicInformation" layout="vertical">
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
                                name="BIC"
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
                                    message: "Please input your IDNO!",
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
                                    message: "Invalid VATCode format",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24}>
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
                </Row>
            </Form>
        </Modal>
    );
};

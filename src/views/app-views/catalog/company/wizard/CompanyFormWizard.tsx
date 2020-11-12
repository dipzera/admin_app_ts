import React, { Component } from "react";
import {
    Form,
    Avatar,
    Button,
    Input,
    DatePicker,
    Row,
    Col,
    message,
    Upload,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import Flex from "../../../../../components/shared-components/Flex";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { updateSettings } from "../../../../../redux/actions/Account";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";
import AppLocale from "../../../../../lang";
import axios from "axios";
import MaskedInput from "antd-mask-input";
import { API_IS_APP_SERVICE } from "../../../../../constants/ApiConstant";
import { signOut, refreshToken } from "../../../../../redux/actions/Auth";
import {
    DONE,
    ERROR,
    EXPIRE_TIME,
    LOADING,
    UPDATING,
    UPLOADED,
    UPLOADING,
} from "../../../../../constants/Messages";
import { WizardContext } from "./WizardContext";
const publicIp = require("react-public-ip");

function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
}

class CompanyFormWizard extends Component<{ [key: string]: any }> {
    avatarEndpoint = "https://www.mocky.io/v2/5cc8019d300000980a055e76";

    static contextType = WizardContext;
    formRef = React.createRef() as any;

    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    render() {
        let { updateSettings, removeAvatar, locale, signOut } = this.props;

        const onChangeMask = (e) => {
            this.setState({ [e.target.name]: e.target.value });
        };
        const currentAppLocale = AppLocale[locale];
        const onFinish = async (values) => {
            this.context.setWizardData({
                ...this.context.wizardData,
                CompanyData: {
                    Company: {
                        ...this.context.wizardData.CompanyData.Company,
                        ...values,
                    },
                    Token: this.props.token,
                    info: await publicIp.v4(),
                },
            });
            this.context.setCurrent(this.context.current + 1);
        };

        const onFinishFailed = (errorInfo) => {
            console.log("Failed:", errorInfo);
        };

        const onUploadAavater = (info) => {
            const key = "updatable";
            if (info.file.status === "uploading") {
                message.loading({ content: UPLOADING, key });
                return;
            }
            if (info.file.status === "done") {
                this.getBase64(info.file.originFileObj, async (imageUrl) => {
                    this.context.setWizardData({
                        ...this.context.wizardData,
                        CompanyData: {
                            Company: {
                                ...this.context.wizardData.CompanyData.Company,
                                Logo: imageUrl,
                            },
                        },
                    });
                });
                message.success({ content: UPLOADED, key });
            } else {
                message.error({ content: ERROR, key });
            }
        };

        const onRemoveAvater = async () => {
            this.context.setWizardData({
                ...this.context.wizardData,
                CompanyData: {
                    Company: {
                        ...this.context.wizardData.CompanyData.Company,
                        Logo: "",
                    },
                },
            });
        };

        return (
            <>
                <Flex
                    alignItems="center"
                    mobileFlex={false}
                    className="text-center text-md-left"
                >
                    <Avatar
                        size={90}
                        src={
                            this.context.wizardData.CompanyData.Company &&
                            this.context.wizardData.CompanyData.Company.Logo
                        }
                        icon={<UserOutlined />}
                    />
                    <div className="ml-md-3 mt-md-0 mt-3">
                        <Upload
                            onChange={onUploadAavater}
                            showUploadList={false}
                            action={this.avatarEndpoint}
                            // beforeUpload={beforeUpload}
                        >
                            <Button type="primary">Upload Avatar</Button>
                        </Upload>
                        <Button className="ml-2" onClick={onRemoveAvater}>
                            <IntlMessage id={"account.EditProfile.Remove"} />
                        </Button>
                    </div>
                </Flex>
                <div className="mt-4">
                    <Form
                        name="basicInformation"
                        layout="vertical"
                        initialValues={
                            this.context.wizardData.CompanyData.Company
                        }
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                    >
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={16}>
                                <Row gutter={ROW_GUTTER}>
                                    <Col xs={24} sm={24} md={12}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={"account.company.BIC"}
                                                />
                                            }
                                            name="BIC"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your BIC!",
                                                },
                                                {
                                                    pattern: /[A-Z]{4}-[A-Z]{2}-[0-9]{5}/,
                                                    message:
                                                        "Invalid BIC format",
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
                                            label={
                                                <IntlMessage
                                                    id={"account.company.Bank"}
                                                />
                                            }
                                            name="Bank"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your bank!",
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
                                                    id={
                                                        "account.company.CommercialName"
                                                    }
                                                />
                                            }
                                            name="CommercialName"
                                            rules={[
                                                {
                                                    required: false,
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
                                            label={
                                                <IntlMessage
                                                    id={"account.company.IBAN"}
                                                />
                                            }
                                            name="IBAN"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your IBAN!",
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
                                                    id={"account.company.IDNO"}
                                                />
                                            }
                                            name="IDNO"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your IDNO!",
                                                },
                                                {
                                                    pattern: /^(\d{13})?$/,
                                                    message: (
                                                        <IntlMessage
                                                            id={
                                                                "auth.IDNOValidation"
                                                            }
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
                                                    id={
                                                        "account.company.JuridicalAddress"
                                                    }
                                                />
                                            }
                                            name="JuridicalAddress"
                                            rules={[
                                                {
                                                    required: false,
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
                                                    id={
                                                        "account.company.JuridicalName"
                                                    }
                                                />
                                            }
                                            name="JuridicalName"
                                            rules={[
                                                {
                                                    required: false,
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
                                                    id={
                                                        "account.company.PhoneNumber"
                                                    }
                                                />
                                            }
                                            name="PhoneNumber"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your phone number!",
                                                },
                                                {
                                                    pattern: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                                                    message:
                                                        "Invalid phone format!",
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
                                                    id={
                                                        "account.company.OfficeAddress"
                                                    }
                                                />
                                            }
                                            name="OfficeAddress"
                                            rules={[
                                                {
                                                    required: false,
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
                                                <IntlMessage
                                                    id={
                                                        "account.company.VATCode"
                                                    }
                                                />
                                            }
                                            name="VATCode"
                                            rules={[
                                                {
                                                    required: false,
                                                    message:
                                                        "Please input your VAT code!",
                                                },
                                                {
                                                    pattern: /^[0-9]+$/,
                                                    message:
                                                        "Invalid VATCode format",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={24} md={24}>
                                        <Form.Item
                                            label={
                                                <IntlMessage
                                                    id={
                                                        "account.EditProfile.Email"
                                                    }
                                                />
                                            }
                                            name="Email"
                                            rules={[
                                                {
                                                    required: false,
                                                    type: "email",
                                                    message:
                                                        "Please enter a valid email!",
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

const mapDispatchToProps = {
    updateSettings,
    signOut,
    refreshToken,
};

const mapStateToProps = ({ account, theme, auth }) => {
    const { name, userName, avatar, dateOfBirth, email, phoneNumber } = account;
    const { token } = auth;
    const { locale } = theme;
    return {
        name,
        userName,
        token,
        avatar,
        dateOfBirth,
        email,
        phoneNumber,
        locale,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyFormWizard);

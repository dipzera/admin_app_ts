import React, { Component } from "react";
import { Form, Avatar, Button, Input, Row, Col, message, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../../../constants/ThemeConstant";
import Flex from "../../../../../components/shared-components/Flex";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import MaskedInput from "antd-mask-input";
import { ERROR, UPLOADED, UPLOADING } from "../../../../../constants/Messages";
import { IWizard, WizardContext } from "./WizardContext";
import Utils from "../../../../../utils";
import { ICompanyData } from "../../../../../api/app/types";
import { UploadChangeParam } from "antd/lib/upload";
import { Link } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../../configs/AppConfig";

class CompanyFormWizard extends Component {
  static contextType = WizardContext;

  render() {
    const onChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ [e.target.name]: e.target.value });
    };

    const onFinish = async (values: ICompanyData) => {
      this.context.setWizardData({
        ...this.context.wizardData,
        CompanyData: {
          ...this.context.wizardData.CompanyData,
          ...values,
        },
      });
      this.context.setCurrent(this.context.current + 1);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    const onUploadAavater = (info: UploadChangeParam) => {
      const key = "updatable";
      if (info.file.status === "uploading") {
        message.loading({ content: UPLOADING, key });
        return;
      }
      if (info.file.status === "done") {
        Utils.getBase64(info.file.originFileObj, async (imageUrl: string) => {
          this.context.setWizardData({
            ...this.context.wizardData,
            CompanyData: {
              ...this.context.wizardData.CompanyData,
              Logo: imageUrl,
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
          ...this.context.wizardData.CompanyData,
          Logo: "",
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
              this.context.wizardData.CompanyData &&
              this.context.wizardData.CompanyData.Logo
            }
            icon={<UserOutlined />}
          />
          <div className="ml-md-3 mt-md-0 mt-3">
            <Upload
              onChange={onUploadAavater}
              showUploadList={false}
              customRequest={Utils.dummyRequest}
              beforeUpload={(info) => Utils.beforeUpload(info)}
            >
              <Button type="primary">
                <IntlMessage id="wizard.UploadAvatar" />
              </Button>
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
            initialValues={this.context.wizardData.CompanyData}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={12}>
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
                        // {
                        //     pattern: /[A-Z]{4}-[A-Z]{2}-[0-9]{5}/,
                        //     message:
                        //         "Invalid BIC format",
                        // },
                      ]}
                    >
                      {/* <MaskedInput
                                                mask="AAAA-AA-11111"
                                                name="BIC"
                                                onChange={onChangeMask}
                                            /> */}
                      <Input />
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
                        <IntlMessage id={"account.company.CommercialName"} />
                      }
                      name="CommercialName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your commercial name!",
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
                          message: <IntlMessage id={"auth.IDNOValidation"} />,
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <IntlMessage id={"account.company.JuridicalAddress"} />
                      }
                      name="JuridicalAddress"
                      rules={[
                        {
                          required: true,
                          message: "Please input your juridical address!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={
                        <IntlMessage id={"account.company.JuridicalName"} />
                      }
                      name="JuridicalName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your juridical name!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={<IntlMessage id={"account.company.PhoneNumber"} />}
                      name="PhoneNumber"
                      rules={[
                        {
                          required: false,
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
                        <IntlMessage id={"account.company.OfficeAddress"} />
                      }
                      name="OfficeAddress"
                      rules={[
                        {
                          required: true,
                          message: "Please input your office address!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={<IntlMessage id={"account.company.VATCode"} />}
                      name="VATCode"
                      rules={[
                        {
                          required: false,
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
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={<IntlMessage id="account.company.ShortName" />}
                      name="ShortName"
                      rules={[
                        {
                          required: false,
                          message: "Please input short name!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={"Website"}
                      name="WebSite"
                      rules={[
                        {
                          required: false,
                          message: "Please input website!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24}>
                    <Form.Item
                      label={<IntlMessage id={"account.EditProfile.Email"} />}
                      name="Email"
                      rules={[
                        {
                          required: false,
                          type: "email",
                          message: "Please enter a valid email!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Button htmlType="submit" type="primary">
                      <IntlMessage id="wizard.Next" />
                    </Button>
                    <Button type="ghost" className="ml-2">
                      <Link to={`${APP_PREFIX_PATH}/catalog/companies`}>
                        <IntlMessage id="app.Cancel" />
                      </Link>
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

export default CompanyFormWizard;

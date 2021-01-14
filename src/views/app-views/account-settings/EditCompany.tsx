import React, { Component } from "react";
import { Form, Avatar, Button, Input, Row, Col, message, Upload } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Flex from "../../../components/shared-components/Flex";
import IntlMessage from "../../../components/util-components/IntlMessage";
import { updateSettings } from "../../../redux/actions/Account";
import { connect } from "react-redux";
import MaskedInput from "antd-mask-input";
import { DONE, UPDATING, UPLOADING } from "../../../constants/Messages";
import { AppService } from "../../../api";
import Utils from "../../../utils";
import TranslateText from "../../../utils/translate";
import { ICompanyData } from "../../../api/types.response";
import { FormInstance } from "antd/lib/form";
import { UploadChangeParam } from "antd/lib/upload";

class CompanyForm extends Component {
  state = {} as ICompanyData;
  formRef = React.createRef<FormInstance>();

  getCompanyInfo = async () => {
    return await new AppService().GetCompanyInfo().then((data) => {
      if (data && data.ErrorCode === 0) {
        this.setState({ ...data.Company });
        this.formRef["current"]!.setFieldsValue(data.Company);
      }
    });
  };
  updateCompany = async (values: ICompanyData) => {
    return await new AppService()
      .UpdateCompany({
        Company: { ...this.state, ...values },
      })
      .then(async (data) => {
        if (data && data.ErrorCode === 0) this.getCompanyInfo();
      });
  };
  componentDidMount() {
    this.getCompanyInfo();
  }

  render() {
    const onChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ [e.target.name]: e.target.value });
    };
    const onFinish = async (values: ICompanyData) => {
      const key = "updatable";
      message.loading({
        content: TranslateText(UPDATING),
        key,
      });
      setTimeout(async () => {
        this.updateCompany({ ...values }).then(() =>
          message.success({
            content: TranslateText(DONE),
            key: "updatable",
            duration: 1,
          })
        );
      }, 1000);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    const onUploadAavater = (info: UploadChangeParam) => {
      const key = "updatable";
      if (info.file.status === "uploading") {
        message.loading({
          content: TranslateText(UPLOADING),
          key,
        });
        return;
      }
      if (info.file.status === "done") {
        message.success({
          content: TranslateText(DONE),
          key: "updatable",
          duration: 1,
        });
        Utils.getBase64(info.file.originFileObj, async (imageUrl: string) => {
          await this.updateCompany({
            ...this.state,
            Logo: imageUrl,
          });
        });
        return;
      }
    };

    const onRemoveAvater = async () => {
      await this.updateCompany({ ...this.state, Logo: "" }).then(() => {
        this.setState({ ...this.state, Logo: "" });
      });
    };

    return (
      <>
        <Flex
          alignItems="center"
          mobileFlex={false}
          className="text-center text-md-left"
        >
          <Avatar size={90} src={this.state.Logo} icon={<UserOutlined />} />
          <div className="ml-md-3 mt-md-0 mt-3">
            <Upload
              customRequest={Utils.dummyRequest}
              onChange={onUploadAavater}
              showUploadList={false}
              beforeUpload={(info) => Utils.beforeUpload(info)}
            >
              <Button type="primary">
                <IntlMessage id={"account.EditProfile.ChangeAvatar"} />
              </Button>
            </Upload>
            <Button className="ml-2" onClick={onRemoveAvater}>
              <IntlMessage id={"account.EditProfile.Remove"} />
            </Button>
          </div>
        </Flex>
        <div className="mt-4">
          <Form
            ref={this.formRef}
            name="basicInformation"
            layout="vertical"
            initialValues={this.state}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={16}>
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
                      label={<IntlMessage id={"account.company.ShortName"} />}
                      name="ShortName"
                      rules={[
                        {
                          required: false,
                          message: "Please enter a short name!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
                    <Form.Item
                      label={<IntlMessage id={"account.company.PostalCode"} />}
                      name="PostalCode"
                      rules={[
                        {
                          required: false,
                          message: "Please enter a postal code!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12}>
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
                </Row>
                <Button type="primary" htmlType="submit">
                  <IntlMessage id={"account.EditProfile.SaveChange"} />
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    );
  }
}

export default connect(null, { updateSettings })(CompanyForm);

import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Modal, message } from "antd";
import MaskedInput from "antd-mask-input";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { AppService } from "../../../../api";
import { ICompanyData } from "../../../../api/types.response";
import WithStringTranslate from "../../../../utils/translate";
import { DONE } from "../../../../constants/Messages";

export const CompanyModalEdit = ({
  data,
  visible,
  onCancel,
  getCompanyList,
}: any) => {
  const [form] = Form.useForm();

  const [mask, setMask] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  /* Above Type may not work, to be tested */
  const onChangeMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMask({ [e.target.name]: e.target.value });
  };

  const onFinish = (values: ICompanyData) => {
    new AppService()
      .UpdateCompany({ Company: { ...data, ...values } })
      .then((data) => {
        if (data) {
          if (data.ErrorCode === 0) {
            getCompanyList().then(() =>
              message.success({
                content: WithStringTranslate(DONE),
                key: "updatable",
                duration: 1.5,
              })
            );
          }
        }
      });
  };
  const onFinishFailed = () => {};

  return (
    <Modal
      destroyOnClose
      title={<IntlMessage id="company.edit.title" />}
      visible={visible}
      okText={` ${WithStringTranslate("account.EditProfile.SaveChange")}`}
      onCancel={onCancel}
      confirmLoading={loading}
      onOk={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          form
            .validateFields()
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
                // {
                //     pattern: /[A-Z]{4}-[A-Z]{2}-[0-9]{5}/,
                //     message: "Invalid BIC format",
                // },
              ]}
            >
              {/* <MaskedInput
                                mask="AAAA-AA-11111"
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
              label={<IntlMessage id={"account.company.CommercialName"} />}
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
                  message: <IntlMessage id={"auth.MessageInsertIDNO"} />,
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
              label={<IntlMessage id={"account.company.JuridicalAddress"} />}
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
              label={<IntlMessage id={"account.company.JuridicalName"} />}
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
              <MaskedInput mask="+(111) 111 111 11" onChange={onChangeMask} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label={<IntlMessage id={"account.company.OfficeAddress"} />}
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
                  message: "Please enter VAT code!",
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
              label={<IntlMessage id={"account.company.Email"} />}
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
              label={<IntlMessage id="account.company.WebSite" />}
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
      </Form>
    </Modal>
  );
};

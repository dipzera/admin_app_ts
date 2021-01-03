import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Modal, message, Select, Empty } from "antd";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import AppLocale from "../../../../lang";
import { AppService } from "../../../../api";
import WithStringTranslate from "../../../../utils/translate";
import { DONE } from "../../../../constants/Messages";
import { IAccount } from "../../../../redux/reducers/Account";
export const UserModalEdit = ({
  data,
  visible,
  onCancel,
  getUsersInfo,
}: any) => {
  const [form] = Form.useForm();
  const [companies, setCompanies] = useState<any>();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [currentCompany, setCurrentCompany] = useState<any>();
  /*  Destroy initialValues of form after Modal is closed */
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  // useEffect(() => {
  //     if (visible) {
  //         new AdminApi().GetBasicCompanyList().then((data: any) => {
  //             if (data) {
  //                 const { CompanyList, ErrorCode } = data;
  //                 if (ErrorCode === 0) {
  //                     setCompanies(CompanyList);
  //                 }
  //             }
  //         });
  //     }
  // }, [visible]);

  // useEffect(() => {
  //     if (companies) {
  //         setCurrentCompany(
  //             companies
  //                 .filter((company) => company.ID === data.CompanyID)
  //                 .map((company) => company.Name)
  //         );
  //     }
  // }, [companies]);
  const onSearch = (value: any) => {
    if (value.length > 1) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = (values: IAccount) => {
    return new AppService()
      .UpdateUser({
        ...data,
        ...values,
      })
      .then((data) => {
        if (data) {
          if (data.ErrorCode === 0) {
            getUsersInfo().then(() =>
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

  const onOk = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
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
  };
  const { Option } = Select;
  return (
    <Modal
      destroyOnClose
      title={<IntlMessage id="user.edit.title" />}
      visible={visible}
      okText={` ${WithStringTranslate("account.EditProfile.SaveChange")}`}
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
              label={<IntlMessage id={"account.EditProfile.FirstName"} />}
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
              label={<IntlMessage id={"account.EditProfile.LastName"} />}
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
              label={<IntlMessage id={"account.EditProfile.Email"} />}
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
              label={<IntlMessage id={"account.EditProfile.PhoneNumber"} />}
              name="PhoneNumber"
            >
              <Input />
            </Form.Item>
          </Col>
          {/* <Col xs={24} sm={24} md={24}>
                        <Form.Item
                            label={"Company"}
                            name="CompanyID"
                            rules={[
                                {
                                    required: true,
                                    message: "Please choose your company!",
                                },
                            ]}
                        >
                            <Select
                                onSearch={onSearch}
                                allowClear
                                placeholder={currentCompany}
                                showSearch
                                filterOption={(input, option) =>
                                    option!.title
                                        .toUpperCase()
                                        .indexOf(input.toUpperCase()) !== -1
                                }
                            >
                                {companies &&
                                    companies.map((company) => (
                                        <Option
                                            value={company.ID}
                                            key={company.ID}
                                        >
                                            {company.Name}
                                        </Option>
                                    ))}
                            </Select>
                        </Form.Item>
                    </Col> */}
        </Row>
      </Form>
    </Modal>
  );
};

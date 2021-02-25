import React, { useEffect, useState } from "react";
import { Input, Row, Col, Form, Modal, message } from "antd";
import IntlMessage from "../../../../components/util-components/IntlMessage";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import { AppService } from "../../../../api/app";
import TranslateText from "../../../../utils/translate";
import { DONE } from "../../../../constants/Messages";
import { IAccount } from "../../../../redux/reducers/Account";
import { IUsers } from "../../../../api/app/types";
interface IUserModalEdit {
  data: IUsers;
  visible: boolean;
  onCancel: () => void;
  getUsersInfo: () => Promise<void>;
}
const UserModalEdit = ({
  data,
  visible,
  onCancel,
  getUsersInfo,
}: IUserModalEdit) => {
  const [form] = Form.useForm();

  /*  Destroy initialValues of form after Modal is closed */
  useEffect(() => {
    if (!visible) return;
    form.resetFields();
  }, [visible, form]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFinish = async (values: IAccount) => {
    return new AppService()
      .UpdateUser({
        ...data,
        ...values,
      })
      .then((data) => {
        if (data && data.ErrorCode === 0) {
          getUsersInfo().then(() =>
            message.success({
              content: TranslateText(DONE),
              key: "updatable",
              duration: 1.5,
            })
          );
        }
      });
  };

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
  return (
    <Modal
      destroyOnClose
      title={<IntlMessage id="user.edit.title" />}
      visible={visible}
      okText={` ${TranslateText("account.EditProfile.SaveChange")}`}
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
        </Row>
      </Form>
    </Modal>
  );
};

export default UserModalEdit;

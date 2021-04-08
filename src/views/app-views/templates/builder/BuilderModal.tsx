import * as React from "react";
import { Form, Modal, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";
import { TemplatesType } from "../../../../api/mail/types";

interface IBuilderModal {
  saveTemplate: (Name: string) => void;
  visible: boolean;
  close: () => void;
  Name?: string;
}
const BuilderModal = ({
  saveTemplate,
  close,
  visible,
  Name,
}: IBuilderModal) => {
  const [form] = useForm();
  return (
    <Modal
      onCancel={() => close()}
      visible={visible}
      title="Save template"
      onOk={async () => {
        form.validateFields().then(async ({ Name }) => {
          close();
          await saveTemplate(Name);
        });
      }}
    >
      <Form form={form}>
        <Form.Item
          name="Name"
          initialValue={Name ?? `Template ${moment().format("LTS")}`}
          rules={[
            {
              required: true,
              message: "Template must have a name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default BuilderModal;

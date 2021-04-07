import * as React from "react";
import { Form, Modal, Input } from "antd";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

interface IBuilderModal {
  saveTemplate: (Name: string) => void;
  visible: boolean;
  close: () => void;
  loading: boolean;
}
const BuilderModal = ({
  saveTemplate,
  close,
  visible,
  loading,
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
          saveTemplate(Name);
        });
      }}
    >
      <Form form={form}>
        <Form.Item
          name="Name"
          initialValue={`Template ${moment().format("LTS")}`}
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

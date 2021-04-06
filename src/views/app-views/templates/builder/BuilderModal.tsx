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
      confirmLoading={loading}
      onOk={async () => {
        form.validateFields().then(async ({ Name }) => {
          await saveTemplate(Name);
          close();
        });
      }}
    >
      <Form form={form}>
        <Form.Item
          name="Name"
          initialValue={`Template ${moment().format("LTS")}`}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default BuilderModal;

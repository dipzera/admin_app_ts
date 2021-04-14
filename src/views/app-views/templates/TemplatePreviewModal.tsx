import { Modal } from "antd";
import Button from "antd/es/button";
import * as React from "react";
import { Link } from "react-router-dom";
import { TemplatesType } from "../../../api/mail/types";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
interface ITemplatePreview extends TemplatesType {
  visible: boolean;
  close: () => void;
}
const TemplatePreviewModal = (props: ITemplatePreview) => {
  const { Name, visible, close, ImageTemplate, ID } = props;
  return (
    <Modal
      title={Name}
      visible={visible}
      onCancel={close}
      footer={[
        <Button key="back" onClick={close} className="mr-2">
          Back
        </Button>,
        <Link to={`${APP_PREFIX_PATH}/templates/builder?id=${ID}`}>
          <Button key="edit" type="primary" onClick={() => {}}>
            Edit
          </Button>
        </Link>,
      ]}
    >
      {ImageTemplate && (
        <img
          src={ImageTemplate}
          alt="Template preview"
          style={{ maxWidth: "100%" }}
        />
      )}
    </Modal>
  );
};
export default TemplatePreviewModal;

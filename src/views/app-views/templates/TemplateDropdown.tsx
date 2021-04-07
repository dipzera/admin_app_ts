import * as React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Divider, Menu, message, Modal, notification } from "antd";
import { Link } from "react-router-dom";
import { TemplatesType } from "../../../api/mail/types";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { MailService } from "../../../api/mail";
import { EnErrorCode } from "../../../api";
const TemplateDropdownMenu = (props: TemplatesType) => {
  const { ID } = props;
  return (
    <Menu>
      <Menu.Item>
        <Link to={`${APP_PREFIX_PATH}/templates/builder?id=${ID}`}>
          <EditOutlined /> <span className="ml-1">Edit</span>
        </Link>
      </Menu.Item>
      <Menu.Item
        onClick={async () => {
          Modal.confirm({
            title: "Are you sure you want to delete this template?",
            onOk: async () => {
              return await new MailService()
                .DeleteTemplate(ID!)
                .then((data) => {
                  if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
                    message.success("Template deleted!");
                  }
                });
            },
          });
        }}
      >
        <DeleteOutlined />
        Delete
      </Menu.Item>
    </Menu>
  );
};
export default TemplateDropdownMenu;

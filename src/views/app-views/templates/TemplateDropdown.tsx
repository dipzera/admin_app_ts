import * as React from "react";
import { EditOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Menu, message, Modal } from "antd";
import { Link } from "react-router-dom";
import { TemplatesType } from "../../../api/mail/types";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
import { MailService } from "../../../api/mail";
import { EnErrorCode } from "../../../api";
interface ITemplateDropdownMenu extends TemplatesType {
  setTemplates: React.Dispatch<React.SetStateAction<TemplatesType[]>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
const TemplateDropdownMenu = (props: ITemplateDropdownMenu) => {
  const { ID, setTemplates, setModalVisible } = props;
  return (
    <Menu
      style={{ borderRadius: 10, border: 0, boxShadow: "2px 2px 4px #eee" }}
    >
      <Menu.Item onClick={() => setModalVisible(true)} key="0">
        <FormOutlined /> Rename
      </Menu.Item>
      <Menu.Item key="1">
        <Link to={`${APP_PREFIX_PATH}/templates/builder?id=${ID}`}>
          <EditOutlined /> Edit
        </Link>
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={async () => {
          Modal.confirm({
            title: "Are you sure you want to delete this template?",
            onOk: async () => {
              return await new MailService()
                .DeleteTemplate(ID!)
                .then((data) => {
                  if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
                    message.success("Template deleted!");
                    setTemplates((prev: any) =>
                      prev.filter((elem: any) => elem.ID !== ID)
                    );
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

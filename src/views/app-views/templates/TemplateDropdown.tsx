import * as React from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Divider, Menu } from "antd";
import { Link } from "react-router-dom";
import { TemplatesType } from "../../../api/mail/types";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";
const TemplateDropdownMenu = (props: TemplatesType) => {
  const { ID } = props;
  return (
    <Menu>
      <Menu.Item>
        <Link to={`${APP_PREFIX_PATH}/templates/builder?id=${ID}`}>
          <EditOutlined /> <span className="ml-1">Edit</span>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <DeleteOutlined />
        Delete
      </Menu.Item>
    </Menu>
  );
};
export default TemplateDropdownMenu;

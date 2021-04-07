import * as React from "react";
import { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Avatar, Card, Dropdown, Menu } from "antd";
import { TemplatesType } from "../../../api/mail/types";
import TemplateImage from "./TemplateImage";
import Tag from "antd/es/tag";
import TemplateDropdownMenu from "./TemplateDropdown";
import TemplatePreviewModal from "./TemplatePreviewModal";
const menuItems = [
  {
    key: "0",
    title: "Edit",
  },
  {
    key: "1",
    title: "Delete",
  },
];
const TemplateCard = (props: TemplatesType) => {
  const { Name, ImageTemplate, State } = props;
  const [preview, setPreview] = useState<boolean>(false);
  const menu = (
    <Menu>
      {menuItems.map((item) => (
        <Menu.Item key={item.key}>{item.title}</Menu.Item>
      ))}
    </Menu>
  );
  return (
    <>
      <TemplatePreviewModal
        {...props}
        visible={preview}
        close={() => setPreview(false)}
      />
      <Card hoverable onClick={() => setPreview(true)}>
        <div className="text-center">
          <div className="template-mask">
            <TemplateImage image={ImageTemplate} />
          </div>
          <div className="mt-3">
            <Dropdown
              overlay={() => <TemplateDropdownMenu {...props} />}
              placement="bottomCenter"
            >
              <a onClick={(e) => e.preventDefault()}>
                {Name.length > 0 ? Name : "Untitled"} <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
      </Card>
    </>
  );
};
export default TemplateCard;

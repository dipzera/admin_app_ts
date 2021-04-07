import * as React from "react";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
interface TemplateImageProps {
  image: string;
}
const TemplateImage = ({ image }: TemplateImageProps) => {
  return (
    <div
      onMouseOver={() => {
        /* show magnifier */
      }}
      onClick={() => {
        /* show preview modal */
      }}
    >
      <Avatar
        icon={<ExperimentOutlined />}
        shape="square"
        src={image}
        size={200}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
};
export default TemplateImage;

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
        size={200}
        src={image}
      />
    </div>
  );
};
export default TemplateImage;

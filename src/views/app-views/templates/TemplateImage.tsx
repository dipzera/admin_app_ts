import * as React from "react";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
interface TemplateImageProps {
  image: string;
  setPreview: React.SetStateAction<React.Dispatch<boolean>>;
}
const TemplateImage = ({ image, setPreview }: TemplateImageProps) => {
  return (
    <div
      onMouseOver={() => {
        /* show magnifier */
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

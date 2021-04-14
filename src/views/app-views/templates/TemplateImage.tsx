import * as React from "react";
import { Avatar } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import "./template.scss";
interface TemplateImageProps {
  image: string;
  setPreview: React.Dispatch<React.SetStateAction<boolean>>;
}
const TemplateImage = ({ image, setPreview }: TemplateImageProps) => {
  return (
    <div className="template-image" onClick={() => setPreview(true)}>
      <div className="loupe">
        <img
          className="loupe__img"
          src={`${process.env.PUBLIC_URL}/img/loupe.svg`}
          alt="Loupe"
        />
      </div>
      <Avatar
        className="template-image"
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

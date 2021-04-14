import * as React from "react";
import { useState } from "react";
import { Card, Dropdown, Menu, message } from "antd";
import { TemplatesType } from "../../../api/mail/types";
import TemplateImage from "./TemplateImage";
import TemplateDropdownMenu from "./TemplateDropdown";
import TemplatePreviewModal from "./TemplatePreviewModal";
import BuilderModal from "./builder/BuilderModal";
import { MailService } from "../../../api/mail";
import { EnErrorCode } from "../../../api";
import { RouteComponentProps } from "react-router-dom";
interface ITemplateCard extends TemplatesType, RouteComponentProps {
  setTemplates: React.Dispatch<React.SetStateAction<TemplatesType[]>>;
}
const TemplateCard = (props: ITemplateCard) => {
  const { Name, ImageTemplate, State, setTemplates, ID } = props;
  const [preview, setPreview] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const updateTemplate = async (Name: string) => {
    return await new MailService()
      .UpdateTemplate({ ...props, Name })
      .then((data) => {
        if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
          message.success("Template renamed!");
        }
      });
  };
  return (
    <>
      <TemplatePreviewModal
        {...props}
        visible={preview}
        close={() => setPreview(false)}
      />
      <BuilderModal
        visible={modalVisible}
        close={() => setModalVisible(false)}
        saveTemplate={updateTemplate}
        Name={Name}
      />
      <Card hoverable>
        <div className="text-center">
          <TemplateImage image={ImageTemplate} setPreview={setPreview} />
          <div className="mt-3" id="components-dropdown-demo-dropdown-button">
            <Dropdown.Button
              overlay={() => (
                <TemplateDropdownMenu
                  {...props}
                  setTemplates={setTemplates}
                  setModalVisible={setModalVisible}
                />
              )}
              placement="bottomCenter"
              onClick={() =>
                props.history.push(props.match.url + `/builder?id=${ID}`)
              }
              size="small"
              style={{ overflow: "hidden" }}
            >
              <span style={{ maxWidth: "150px", overflow: "hidden" }}>
                {Name && Name.length > 0 ? Name : "Untitled"}
              </span>
            </Dropdown.Button>
          </div>
        </div>
      </Card>
    </>
  );
};
export default TemplateCard;

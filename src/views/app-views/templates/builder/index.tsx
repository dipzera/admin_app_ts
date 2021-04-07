import * as React from "react";
import * as htmlToImage from "html-to-image";
import { Button, Spin } from "antd";
import { useRef, useState, useEffect } from "react";
import EmailEditor from "react-email-editor";
import { useDispatch } from "react-redux";
import { toggleCollapsedNav } from "../../../../redux/actions/Theme";
import { MailService } from "../../../../api/mail";
import Utils from "../../../../utils";
import BuilderModal from "./BuilderModal";
import { EnErrorCode } from "../../../../api";
import { RouteComponentProps } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../../configs/AppConfig";
import axios from "axios";
import useQuery from "../../../../utils/hooks/useQuery";
import { TemplatesType } from "../../../../api/mail/types";
async function getImage(design: any) {
  return await axios.post(
    `https://api.unlayer.com/v2/export/image`,
    {
      displayMode: "email",
      design,
    },
    {
      auth: { username: "1", password: "1" },
    }
  );

  // success, data.url
}
// When we edit/visualize an already existing template the url has a query with an id
const Builder = (props: RouteComponentProps) => {
  const { history, match } = props;
  const query = useQuery();
  const emailEditorRef = useRef(null);
  const [template, setTemplate] = useState<TemplatesType | undefined>(
    undefined
  );
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const saveTemplate = async (Name: string) => {
    setLoading(true);
    // @ts-ignore
    emailEditorRef!.current!.editor.exportHtml(async ({ design, html }) => {
      const { data } = await getImage(design);
      console.log(data.data.url);
      return await new MailService()
        .UpdateTemplate({
          ID: +query.get("id")!,
          Name,
          BodyJson: Utils.encodeBase64(design),
          ImageTemplate: data.data.url,
          Body: Utils.encodeBase64(html),
          State: 0,
        })
        .then((data) => {
          setLoading(false);
          if (data && data.ErrorCode === EnErrorCode.NO_ERROR) {
            history.push(`${APP_PREFIX_PATH}/templates`);
          }
        });
    });
  };
  const onLoad = () => {
    // load your own template here
    if (query.get("id")) {
      return new MailService().GetTemplates().then((data) => {
        const currentTemplate = data.Templates.find(
          (temp) => temp.ID === +query.get("id")!
        )!;
        setTemplate(currentTemplate);
        if (currentTemplate)
          // @ts-ignore
          emailEditorRef.current!.editor.loadDesign(
            Utils.decodeBase64(currentTemplate.BodyJson)
          );
        else history.push(match.url);
      });
    }
  };
  useEffect(() => {
    dispatch(toggleCollapsedNav(true));
  }, []);
  return (
    <Spin spinning={loading}>
      <h1 className="mb-3">{query.get("id") && template?.Name}</h1>
      <BuilderModal
        visible={modalVisible}
        loading={loading}
        close={() => setModalVisible(false)}
        saveTemplate={saveTemplate}
      />
      <div className="editor">
        <EmailEditor ref={emailEditorRef} onLoad={onLoad} minHeight={800} />
      </div>
      <div className="mt-4">
        <Button
          type="primary"
          onClick={() => {
            if (query.get("id")) {
              saveTemplate((template && template!.Name) ?? "Untitled");
            } else setModalVisible(true);
          }}
        >
          Save
        </Button>
      </div>
    </Spin>
  );
};
export default Builder;

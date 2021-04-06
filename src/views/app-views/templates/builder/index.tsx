import * as React from "react";
import { Button } from "antd";
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

// When we edit/visualize an already existing template the url has a query with an id
const Builder = (props: RouteComponentProps) => {
  const { history, match } = props;
  const emailEditorRef = useRef(null);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const saveTemplate = async (Name: string) => {
    setLoading(true);
    // @ts-ignore
    emailEditorRef!.current!.editor.exportHtml(async ({ design, html }) => {
      return await new MailService()
        .UpdateTemplate({
          Name,
          BodyJson: Utils.encodeBase64(design),
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
  };
  useEffect(() => {
    dispatch(toggleCollapsedNav(true));
    // Load the already saved template for editing/visualizing
  }, []);
  return (
    <>
      <BuilderModal
        visible={modalVisible}
        loading={loading}
        close={() => setModalVisible(false)}
        saveTemplate={saveTemplate}
      />
      <EmailEditor ref={emailEditorRef} onLoad={onLoad} minHeight={800} />
      <div className="mt-3">
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Save template
        </Button>
      </div>
    </>
  );
};
export default Builder;

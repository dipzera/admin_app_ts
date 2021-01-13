import { Col, Form, message, Row, Select, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import Flex from "../../../components/shared-components/Flex";
import { DONE, UPLOADING } from "../../../constants/Messages";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Utils from "../../../utils";
import TextEditor from "../applications/single-app-page/TextEditor";
import { AppService } from "../../../api";
import { UploadChangeParam } from "antd/lib/upload";
import TranslateText from "../../../utils/translate";

interface ICreateNews {
  getNews: (AppType: number) => void;
  visible: boolean;
  close: () => void;
  AppType: number;
}
const CreateNews = ({ getNews, visible, close, AppType }: ICreateNews) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (!visible) return;
    setPhoto("");
    setHeader("");
    setContent("");
  }, [visible, form]);
  const [photo, setPhoto] = useState<string>("");
  const [header, setHeader] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const onUploadAvatar = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      message.loading({
        content: TranslateText(UPLOADING),
        key: "updatable",
      });
    }
    if (info.file.status === "done") {
      message.success({
        content: TranslateText(DONE),
        key: "updatable",
        duration: 1,
      });
      Utils.getBase64(info.file.originFileObj, (imageUrl: string) => {
        setPhoto(imageUrl);
      });
    }
  };
  const onFinish = () => {
    setLoading(true);
    setTimeout(async () => {
      return await new AppService()
        .UpdateNews({
          ID: 0,
          Photo: photo,
          Content: content,
          Header: header,
          ProductType: AppType,
        })
        .then(async (data) => {
          setLoading(false);
          close();
          if (data) {
            if (data.ErrorCode === 0) {
              getNews(AppType);
            }
          }
        });
    }, 1000);
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Modal
      visible={visible}
      onCancel={close}
      destroyOnClose
      confirmLoading={loading}
      onOk={() => {
        form.validateFields().then(() => {
          onFinish();
        });
      }}
    >
      <Flex
        alignItems="center"
        mobileFlex={false}
        className="text-center text-md-left mb-3"
      >
        <h5>Photo</h5>
        <div className="ml-md-3 mt-md-0 mt-3">
          <Upload
            onChange={onUploadAvatar}
            showUploadList={false}
            name="avatar"
            className="avatar-uploader"
            listType="picture-card"
            customRequest={Utils.dummyRequest}
            beforeUpload={(info) => Utils.beforeUpload(info)}
          >
            {photo ? (
              <img src={photo} alt="News" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
      </Flex>
      <Form form={form} name="createNews" layout="vertical">
        <Row gutter={ROW_GUTTER}>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Header"}>
              <TextEditor
                apps={header}
                handleEditorChange={(field: string) => setHeader(field)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Content"}>
              <TextEditor
                apps={content}
                handleEditorChange={(field: string) => setContent(field)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreateNews;

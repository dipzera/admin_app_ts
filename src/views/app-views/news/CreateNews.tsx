import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { Col, Form, message, Row, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import Flex from "../../../components/shared-components/Flex";
import { DONE, UPLOADING } from "../../../constants/Messages";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Utils from "../../../utils";
import { AppService } from "../../../api/app";
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
  }, [visible, form]);
  const [photo, setPhoto] = useState<string>("");
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
  const onFinish = ({ Header, Content }: any) => {
    setLoading(true);
    setTimeout(async () => {
      return await new AppService()
        .UpdateNews({
          ID: 0,
          Photo: photo,
          Content,
          Header,
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
        form.validateFields().then((values) => {
          onFinish(values);
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
            beforeUpload={Utils.beforeUploadArticle}
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
            <Form.Item label={"Header"} name="Header">
              <ReactQuill />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Content"} name="Content">
              <ReactQuill />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreateNews;

import { Col, Form, message, Modal, Row, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Flex from "../../../components/shared-components/Flex";
import { DONE, UPLOADING } from "../../../constants/Messages";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Utils from "../../../utils";
import TextEditor from "../applications/single-app-page/TextEditor";
import { AppService } from "../../../api";
import Localization from "../../../utils/Localization";
import { INewsList } from "../../../api/types.response";
import { IAntUpload } from "../../../types";
import { UploadChangeParam } from "antd/lib/upload";
interface IEditNews {
  visible: boolean;
  close: () => void;
  news: INewsList;
  getNews: (AppType: number) => void;
}
const EditNews = ({ visible, close, news, getNews }: IEditNews) => {
  const [form] = Form.useForm();
  const [Photo, setPhoto] = useState<string>("");
  const [Header, setHeader] = useState<string>("");
  const [Content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (news) {
      setPhoto(news.Photo);
      setHeader(news.Header);
      setContent(news.Content);
    }
  }, [news]);

  const onUploadAvatar = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      message.loading({
        content: <Localization msg={UPLOADING} />,
        key: "updatable",
      });
    }
    if (info.file.status === "done") {
      message.success({
        content: <Localization msg={DONE} />,
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
          ...news,
          Photo,
          Content,
          Header,
        })
        .then(async (data) => {
          setLoading(false);
          close();
          if (data) {
            if (data.ErrorCode === 0) getNews(news.ProductType);
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
            {Photo ? (
              <img src={Photo} alt="photo" style={{ width: "100%" }} />
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
                apps={Header}
                handleEditorChange={(field: string) => setHeader(field)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Form.Item label={"Content"}>
              <TextEditor
                apps={Content}
                handleEditorChange={(field: string) => setContent(field)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default EditNews;

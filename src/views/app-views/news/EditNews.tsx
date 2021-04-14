import * as React from "react";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import { Col, Form, message, Modal, Row, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Flex from "../../../components/shared-components/Flex";
import { DONE, UPLOADING } from "../../../constants/Messages";
import { ROW_GUTTER } from "../../../constants/ThemeConstant";
import Utils from "../../../utils";
import TextEditor from "../applications/single-app-page/TextEditor";
import { AppService } from "../../../api/app";
import { INewsList } from "../../../api/app/types";
import { UploadChangeParam } from "antd/lib/upload";
import TranslateText from "../../../utils/translate";
interface IEditNews {
  visible: boolean;
  close: () => void;
  news: Partial<INewsList>;
  getNews: (AppType: number) => void;
}
const EditNews = ({ visible, close, news, getNews }: IEditNews) => {
  const [form] = Form.useForm();
  const [Photo, setPhoto] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (news) {
      setPhoto(news.Photo ?? "");
    }
  }, [news]);

  const onUploadAvatar = (info: any) => {
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

  const onFinish = ({ Content, Header }: any) => {
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
          if (data && data.ErrorCode === 0) getNews(news.ProductType ?? 0);
        });
    }, 1000);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  var isSquare: any;
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
            {Photo ? (
              <img src={Photo} alt="News" style={{ width: "100%" }} />
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
export default EditNews;

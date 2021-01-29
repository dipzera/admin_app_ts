import * as React from "react";
import { useState } from "react";
import { Button, Card, Col, message, Row, Select, Tooltip } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { LoadingOutlined, EditOutlined } from "@ant-design/icons";
import { ImageSvg } from "../../../../../assets/svg/icon";
import CustomIcon from "../../../../../components/util-components/CustomIcon";
import Flex from "../../../../../components/shared-components/Flex";
import BasicView from "./BasicView";
import BasicEdit from "./BasicEdit";
import Utils from "../../../../../utils";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import TranslateText from "../../../../../utils/translate";
import { AppService } from "../../../../../api";
import { DONE } from "../../../../../constants/Messages";
const imageUploadProps: any = {
  name: "file",
  multiple: false,
  listType: "picture-card",
  showUploadList: false,
};

const General = ({
  app,
  edit,
  setEdit,
  uploadedImg,
  uploadLoading,
  handleUploadChange,
  setLongDesc,
  status,
  shortDesc,
  setShortDesc,
  longDesc,
  getApp,
}: any) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={17}>
          <Card>
            <Flex justifyContent="between">
              <h4>
                <IntlMessage id="applications.BasicInfo" />
              </h4>
              <Tooltip title="Edit">
                <Button
                  type="primary"
                  onClick={() => {
                    setEdit(!edit);
                  }}
                  className="mb-2"
                  icon={<EditOutlined />}
                />
              </Tooltip>
            </Flex>
            {edit ? (
              <BasicEdit
                setShortDesc={setShortDesc}
                shortDesc={shortDesc}
                setLongDesc={setLongDesc}
                longDesc={longDesc}
              />
            ) : (
              <BasicView app={app} shortDesc={shortDesc} longDesc={longDesc} />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={24} md={7}>
          <Card title={TranslateText("applications.Media")}>
            <Dragger
              {...imageUploadProps}
              customRequest={(file) => Utils.dummyRequest(file)}
              beforeUpload={(info) => Utils.beforeUpload(info)}
              onChange={(e) => handleUploadChange(e)}
            >
              {uploadedImg ? (
                <img src={uploadedImg} alt="avatar" className="img-fluid" />
              ) : (
                <div>
                  {uploadLoading ? (
                    <div>
                      <LoadingOutlined className="font-size-xxl text-primary" />
                      <div className="mt-3">
                        <IntlMessage id="message.Uploading" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <CustomIcon className="display-3" svg={ImageSvg} />
                      <p>
                        <IntlMessage id="applications.ClickOrDrag" />
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Dragger>
          </Card>
          <Card title={TranslateText("applications.Status")}>
            <Select
              className="w-100"
              placeholder="Status"
              defaultValue={status}
              loading={loading}
              disabled={loading}
              onChange={async (value) => {
                setLoading(true);
                return await new AppService()
                  .ChangeMarketAppStatus(app.ID, value)
                  .then((data) => {
                    setLoading(false);
                    if (data && data.ErrorCode === 0) {
                      getApp();
                      message.success({
                        content: TranslateText(DONE),
                        key: "updatable",
                        duration: 1,
                      });
                    }
                  });
              }}
            >
              <Select.Option value={0}>
                <IntlMessage id="applications.status.NotActive" />
              </Select.Option>
              <Select.Option value={1}>
                <IntlMessage id="applications.status.Active" />
              </Select.Option>
            </Select>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default General;

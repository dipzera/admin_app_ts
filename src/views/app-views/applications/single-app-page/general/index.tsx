import { Button, Card, Col, message, Row, Select, Tooltip } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { LoadingOutlined, EditOutlined } from "@ant-design/icons";
import React from "react";
import { ImageSvg } from "../../../../../assets/svg/icon";
import CustomIcon from "../../../../../components/util-components/CustomIcon";
import Flex from "../../../../../components/shared-components/Flex";
import BasicView from "./BasicView";
import BasicEdit from "./BasicEdit";
import { useSelector } from "react-redux";
const imageUploadProps: any = {
    name: "file",
    multiple: false,
    listType: "picture-card",
    showUploadList: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
};

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
};
const General = ({
    app,
    edit,
    setEdit,
    uploadedImg,
    uploadLoading,
    handleUploadChange,
    setLongDesc,
    changeMarketAppStatus,
    status,
    shortDesc,
    setShortDesc,
    longDesc,
}) => {
    const loading = useSelector((state) => state["auth"].loading);
    return (
        <>
            <Row gutter={16}>
                <Col xs={24} sm={24} md={17}>
                    <Card>
                        <Flex justifyContent="between">
                            <h4>Basic Info</h4>
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
                                app={app}
                                setLongDesc={setLongDesc}
                                longDesc={longDesc}
                            />
                        ) : (
                            <BasicView
                                app={app}
                                shortDesc={shortDesc}
                                longDesc={longDesc}
                            />
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={7}>
                    <Card title="Media">
                        <Dragger
                            {...imageUploadProps}
                            beforeUpload={beforeUpload}
                            onChange={(e) => handleUploadChange(e)}
                        >
                            {uploadedImg ? (
                                <img
                                    src={uploadedImg}
                                    alt="avatar"
                                    className="img-fluid"
                                />
                            ) : (
                                <div>
                                    {uploadLoading ? (
                                        <div>
                                            <LoadingOutlined className="font-size-xxl text-primary" />
                                            <div className="mt-3">
                                                Uploading
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <CustomIcon
                                                className="display-3"
                                                svg={ImageSvg}
                                            />
                                            <p>Click or drag file to upload</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Dragger>
                    </Card>
                    <Card title="Status">
                        <Select
                            className="w-100"
                            placeholder="Status"
                            defaultValue={status}
                            loading={loading}
                            disabled={loading}
                            onChange={(value) => {
                                changeMarketAppStatus(value);
                            }}
                        >
                            <Select.Option value={0}>Disabled</Select.Option>
                            <Select.Option value={1}>Active</Select.Option>
                        </Select>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default General;

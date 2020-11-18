import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Row,
    Select,
    Switch,
    Tag,
    Tooltip,
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { LoadingOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { ImageSvg } from "../../../../../assets/svg/icon";
import CustomIcon from "../../../../../components/util-components/CustomIcon";
import TextEditor from "../TextEditor";
import Flex from "../../../../../components/shared-components/Flex";
import BasicView from "./BasicView";
import BasicEdit from "./BasicEdit";
import MediaEdit from "./MediaEdit";
import MediaView from "./MediaView";
import { useSelector } from "react-redux";
const imageUploadProps: any = {
    name: "file",
    multiple: false,
    listType: "picture-card",
    showUploadList: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
};
const rules = {
    name: [
        {
            required: true,
            message: "Please enter product name",
        },
    ],
    ShortDescription: [
        {
            required: true,
            message: "Please enter short description",
        },
    ],
    LongDescription: [
        {
            required: false,
            message: "Please enter long description",
        },
    ],
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
    setStatus,
    changeMarketAppStatus,
    status,
    shortDesc,
    setShortDesc,
}) => {
    /* I'd rather enter edit mode only for LongDescription Component,
    which means making a Edit Button only for Long Description, and switching between edit/view only for this input
     */
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
                                rules={rules}
                            />
                        ) : (
                            <BasicView app={app} />
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
                    {/* {edit ? (
                        <MediaEdit
                            imageUploadProps={imageUploadProps}
                            beforeUpload={beforeUpload}
                            handleUploadChange={handleUploadChange}
                            uploadedImg={uploadedImg}
                            uploadLoading={uploadLoading}
                        />
                    ) : (
                        <MediaView app={app} />
                    )} */}
                    <Card title="Status">
                        <Select
                            className="w-100"
                            placeholder="Status"
                            defaultValue={status}
                            onChange={(value) => setStatus(value)}
                        >
                            <Select.Option value={0}>Disable</Select.Option>
                            <Select.Option value={1}>Active</Select.Option>
                        </Select>
                        <Button
                            type="primary"
                            className="mt-3"
                            loading={loading}
                            onClick={() => changeMarketAppStatus(status)}
                        >
                            Save
                        </Button>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default General;

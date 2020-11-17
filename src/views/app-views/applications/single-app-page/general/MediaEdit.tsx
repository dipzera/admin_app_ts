import { Card } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import Dragger from "antd/lib/upload/Dragger";
import CustomIcon from "../../../../../components/util-components/CustomIcon";
import { ImageSvg } from "../../../../../assets/svg/icon";

const MediaEdit = ({
    imageUploadProps,
    beforeUpload,
    handleUploadChange,
    uploadedImg,
    uploadLoading,
}) => {
    return (
        <Card title="Media">
            <Dragger
                {...imageUploadProps}
                beforeUpload={beforeUpload}
                onChange={(e) => handleUploadChange(e)}
            >
                {uploadedImg ? (
                    <img src={uploadedImg} alt="avatar" className="img-fluid" />
                ) : (
                    <div>
                        {uploadLoading ? (
                            <div>
                                <LoadingOutlined className="font-size-xxl text-primary" />
                                <div className="mt-3">Uploading</div>
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
    );
};
export default MediaEdit;

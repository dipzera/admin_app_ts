import React from "react";
import { Avatar, Card } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { ExperimentOutlined } from "@ant-design/icons";

const MediaView = ({ app }) => {
    return (
        <Card title="Media">
            <Dragger disabled>
                {app.Photo ? (
                    <img src={app.Photo} alt="avatar" className="img-fluid" />
                ) : (
                    <Avatar
                        icon={<ExperimentOutlined />}
                        size={72}
                        shape="square"
                        alt="avatar"
                        className="img-fluid"
                    />
                )}
            </Dragger>
        </Card>
    );
};
export default MediaView;

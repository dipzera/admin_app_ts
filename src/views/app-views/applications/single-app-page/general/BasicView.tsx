import { Form } from "antd";
import React from "react";
const BasicValuesStyles = {
    paddingLeft: "10px",
};
const BasicView = ({ app }) => {
    return (
        <>
            <Form.Item label="Application Name:">
                <div style={BasicValuesStyles}>{app.Name}</div>
            </Form.Item>
            <Form.Item label="Short description:">
                <div style={BasicValuesStyles}>{app.ShortDescription}</div>
            </Form.Item>
            <Form.Item label="Long description:">
                <div
                    style={BasicValuesStyles}
                    className="mt-2"
                    dangerouslySetInnerHTML={{
                        __html: app.LongDescription,
                    }}
                ></div>
            </Form.Item>
        </>
    );
};
export default BasicView;

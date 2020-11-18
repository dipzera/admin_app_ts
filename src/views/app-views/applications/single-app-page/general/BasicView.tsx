import { Form } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const BasicValuesStyles = {
    paddingLeft: "10px",
};
const BasicView = ({ app }) => {
    const locale = useSelector((state) => state["theme"].locale);
    return (
        <>
            <Form.Item label="Application Name">
                <div style={BasicValuesStyles}>{app.Name}</div>
            </Form.Item>
            <Form.Item label="Short description">
                <div style={BasicValuesStyles}>
                    {/* {JSON.parse(atob(app.ShortDescription))} */}
                </div>
            </Form.Item>
            <Form.Item label="Long description">
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

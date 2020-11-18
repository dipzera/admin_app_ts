import { Form } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
const BasicValuesStyles = {
    paddingLeft: "10px",
};
const BasicView = ({ app, shortDesc, longDesc }) => {
    const locale = useSelector((state) => state["theme"].locale);
    return (
        <>
            <Form.Item label="Application Name">
                <div style={BasicValuesStyles}>{app.Name}</div>
            </Form.Item>
            <Form.Item label="Short description">
                <div style={BasicValuesStyles}>
                    {shortDesc ? shortDesc[locale].text : null}
                    {/* {JSON.parse(atob(app.ShortDescription))} */}
                </div>
            </Form.Item>
            <Form.Item label="Long description">
                <div
                    style={BasicValuesStyles}
                    className="mt-2"
                    dangerouslySetInnerHTML={{
                        __html: longDesc ? longDesc[locale].text : null,
                    }}
                ></div>
            </Form.Item>
        </>
    );
};
export default BasicView;

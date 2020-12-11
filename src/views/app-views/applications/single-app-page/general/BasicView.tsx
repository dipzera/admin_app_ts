import { Form } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { IState } from "../../../../../redux/reducers";
import { IApps } from "../../../../../redux/reducers/Applications";
const BasicValuesStyles = {
    paddingLeft: "10px",
};
const BasicView = ({ app, shortDesc, longDesc }: any) => {
    const locale =
        useSelector((state: IState) => state["theme"].locale) ?? "en";
    return (
        <>
            <Form.Item label="Application Name">
                <div style={BasicValuesStyles}>{app.Name}</div>
            </Form.Item>
            {/* <Form.Item label="Back Office URI">
                <div style={BasicValuesStyles}>{app.BackOfficeURI}</div>
            </Form.Item> */}
            <Form.Item label="Short description">
                <div style={BasicValuesStyles}>
                    {shortDesc ? shortDesc[locale] : null}
                </div>
            </Form.Item>
            <Form.Item label="Long description">
                <div
                    style={BasicValuesStyles}
                    className="mt-2"
                    dangerouslySetInnerHTML={{
                        __html: longDesc ? longDesc[locale] : null,
                    }}
                ></div>
            </Form.Item>
        </>
    );
};
export default BasicView;

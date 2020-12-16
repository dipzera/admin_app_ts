import { Form } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { IState } from "../../../../../redux/reducers";
import WithStringTranslate from "../../../../../utils/translate";
const BasicValuesStyles = {
    paddingLeft: "10px",
};
const BasicView = ({ app, shortDesc, longDesc }: any) => {
    const locale =
        useSelector((state: IState) => state["theme"].locale) ?? "en";
    return (
        <>
            <Form.Item label={WithStringTranslate("applications.AppName")}>
                <div style={BasicValuesStyles}>{app.Name}</div>
            </Form.Item>
            {/* <Form.Item label="Back Office URI">
                <div style={BasicValuesStyles}>{app.BackOfficeURI}</div>
            </Form.Item> */}
            <Form.Item
                label={WithStringTranslate("applications.ShortDescription")}
            >
                <div style={BasicValuesStyles}>
                    {shortDesc ? shortDesc[locale] : null}
                </div>
            </Form.Item>
            <Form.Item
                label={WithStringTranslate("applications.LongDescription")}
            >
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

import { Form } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { ILocale, IMarketAppList } from "../../../../../api/app/types";
import { IState } from "../../../../../redux/reducers";
import TranslateText from "../../../../../utils/translate";
const BasicValuesStyles = {
  paddingLeft: "10px",
};
const BasicView = ({
  app,
  shortDesc,
  longDesc,
}: {
  app: IMarketAppList;
  shortDesc: ILocale;
  longDesc: ILocale;
}) => {
  const locale = useSelector((state: IState) => state["theme"].locale) ?? "en";
  return (
    <>
      <Form.Item label={TranslateText("applications.AppName")}>
        <div style={BasicValuesStyles}>{app.Name}</div>
      </Form.Item>
      <Form.Item label={TranslateText("applications.ShortDescription")}>
        <div style={BasicValuesStyles}>{shortDesc[locale]}</div>
      </Form.Item>
      <Form.Item label={TranslateText("applications.LongDescription")}>
        <div
          style={BasicValuesStyles}
          className="mt-2"
          dangerouslySetInnerHTML={{
            __html: longDesc[locale],
          }}
        ></div>
      </Form.Item>
    </>
  );
};
export default BasicView;

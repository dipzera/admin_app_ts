import React, { useContext, useEffect } from "react";
import { Form } from "antd";
import { useSelector } from "react-redux";
import { ILocale, IMarketAppList } from "../../../../../api/app/types";
import { IState } from "../../../../../redux/reducers";
import TranslateText from "../../../../../utils/translate";
import { AppContext } from "../AppContext";
const BasicValuesStyles = {
  paddingLeft: "10px",
};
const BasicView = () => {
  const { state, longDesc, shortDesc } = useContext(AppContext);
  const locale = useSelector((state: IState) => state["theme"].locale) ?? "en";
  return (
    <>
      <Form.Item label={TranslateText("applications.AppName")}>
        <div style={BasicValuesStyles}>{state.selectedApp.Name}</div>
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

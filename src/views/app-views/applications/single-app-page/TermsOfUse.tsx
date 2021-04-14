import { Button, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import TextEditor from "./TextEditor";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../../../redux/reducers";
import { ILocale, IMarketAppList } from "../../../../api/app/types";
import { AppService } from "../../../../api/app";
import { AppContext } from "./AppContext";
import Utils from "../../../../utils";

export interface ITextArea {
  title: string;
  locale: "en" | "ro" | "ru";
}
const textarea: ITextArea[] = [
  {
    title: "English",
    locale: "en",
  },
  {
    title: "Romanian",
    locale: "ro",
  },
  {
    title: "Russian",
    locale: "ru",
  },
];
const TermsOfUse = () => {
  const { state, dispatch, getApp } = useContext(AppContext);
  const [edit, setEdit] = useState<boolean>(false);
  const [terms, setTerms] = useState<Partial<ILocale>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const locale: "en" | "ro" | "ru" =
    useSelector((state: IState) => state["theme"].locale) ?? "en";
  useEffect(() => {
    try {
      setTerms(Utils.decodeBase64Locale(state.selectedApp.TermsOfUse));
    } catch {
      setTerms({ en: "", ru: "", ro: "" });
    }
  }, []);

  const onFinish = () => {
    const {
      ID,
      LongDescription,
      Name,
      ShortDescription,
      Status,
      Photo,
    } = state.selectedApp as IMarketAppList;
    setLoading(true);
    return new AppService()
      .UpdateMarketApp({
        ID,
        LongDescription,
        Name,
        ShortDescription,
        Status,
        Photo,
        TermsOfUse: Utils.encodeBase64Locale(terms),
      })
      .then((data) => {
        setLoading(false);
        if (data && data.ErrorCode === 0) {
          getApp();
          setEdit(false);
        }
      });
  };
  return (
    <>
      <Flex justifyContent="between" alignItems="center" className="py-2">
        <h2 className="mb-4" style={{ visibility: "hidden" }}>
          Terms of use
        </h2>
        <div>
          <Tooltip title="Edit">
            <Button icon={<EditOutlined />} onClick={() => setEdit(!edit)} />
          </Tooltip>
        </div>
      </Flex>
      {edit ? (
        <>
          {textarea.map(({ title, locale }) => (
            <div key={locale} className="mb-3">
              <h4>{title}</h4>
              <TextEditor
                apps={terms![locale] ?? ""}
                handleEditorChange={(content: string) => {
                  setTerms((prevState: Partial<ILocale>) => ({
                    ...prevState,
                    [locale]: content,
                  }));
                }}
              />
            </div>
          ))}
          <Button type="ghost" className="mr-2" onClick={() => setEdit(false)}>
            Discard
          </Button>
          <Button
            type="primary"
            className="mt-3"
            onClick={onFinish}
            loading={loading}
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <p
            dangerouslySetInnerHTML={{
              /* Filter from API */
              __html: terms[locale] ?? "",
            }}
          ></p>
        </>
      )}
    </>
  );
};
export default TermsOfUse;

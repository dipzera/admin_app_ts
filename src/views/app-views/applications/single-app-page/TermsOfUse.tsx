import { Button, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import TextEditor from "./TextEditor";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { IState } from "../../../../redux/reducers";
import { ILocale, IMarketAppList } from "../../../../api/types.response";
import { AppService } from "../../../../api";

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
const TermsOfUse = ({
  app,
  getApp,
}: {
  app: Partial<IMarketAppList>;
  getApp: () => void;
}) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [terms, setTerms] = useState<Partial<ILocale>>({});
  const locale: "en" | "ro" | "ru" =
    useSelector((state: IState) => state["theme"].locale) ?? "en";
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      setTerms(JSON.parse(window.atob(app!.TermsOfUse!.toString())));
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
    } = app as IMarketAppList;
    return new AppService()
      .UpdateMarketApp({
        ID,
        LongDescription,
        Name,
        ShortDescription,
        Status,
        Photo,
        TermsOfUse: Buffer.from(JSON.stringify(terms)).toString("base64"),
      })
      .then((data) => {
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
          <Button type="primary" className="mt-3" onClick={onFinish}>
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

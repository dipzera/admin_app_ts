import { Form, Input, Select } from "antd";
import { lang } from "../../../../../assets/data/language.data.json";
import * as React from "react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextEditor from "../TextEditor";
import Flex from "../../../../../components/shared-components/Flex";
import { IState } from "../../../../../redux/reducers";
import WithStringTranslate from "../../../../../utils/translate";
import IntlMessage from "../../../../../components/util-components/IntlMessage";
import { ILocale } from "../../../../../api/types.response";
import { ITextArea } from "../TermsOfUse";
const rules = {
  name: [
    {
      required: true,
      message: "Please enter product name",
    },
  ],
  ShortDescription: [
    {
      required: true,
      message: "Please enter short description",
    },
  ],
  LongDescription: [
    {
      required: false,
      message: "Please enter long description",
    },
  ],
};
const BasicEdit = ({
  longDesc,
  setLongDesc,
  setShortDesc,
  shortDesc,
}: {
  longDesc: Partial<ILocale>;
  setLongDesc: Dispatch<SetStateAction<Partial<ILocale>>>;
  setShortDesc: Dispatch<SetStateAction<Partial<ILocale>>>;
  shortDesc: Partial<ILocale>;
}) => {
  const fields: ITextArea[] = [
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
  const globalLanguage = useSelector((state: IState) => state["theme"].locale);
  const [shortDescLang, setShortDescLang] = useState(globalLanguage);
  const [longDescLang, setLongDescLang] = useState(globalLanguage);
  const [selectedShortDesc, setSelectedShortDesc] = useState<ITextArea[]>([]);
  const [selectedLongDesc, setSelectedLongDesc] = useState<ITextArea[]>([]);
  const onChange = (name: string, value: string) => {
    setShortDesc((prevState: Partial<ILocale>) => ({
      ...prevState,
      [name]: value,
    }));
  };
  useEffect(() => {
    setSelectedShortDesc(
      fields.filter((field) => shortDescLang == field.locale)
    );
    setSelectedLongDesc(fields.filter((field) => longDescLang == field.locale));
  }, [lang, longDescLang]);

  return (
    <>
      <Form.Item
        name="Name"
        label={WithStringTranslate("applications.AppName")}
        rules={rules.name}
      >
        <Input />
      </Form.Item>
      {/* <Form.Item name="BackOfficeURI" label="Back Office URI">
                <Input />
            </Form.Item> */}
      <div className="form__item shortdesc mb-3">
        <Flex alignItems="center" className="mb-2" justifyContent="between">
          <h5>
            <IntlMessage id="applications.ShortDescription" />
          </h5>
          <div className="ml-2 mb-1">
            <Select
              defaultValue={globalLanguage}
              onChange={(e) => setShortDescLang(e)}
            >
              {fields.map(({ title, locale }) => (
                <Select.Option value={locale} key={locale}>
                  {title}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Flex>
        {selectedShortDesc &&
          selectedShortDesc.map(({ title, locale }) => (
            <div key={locale}>
              {/* <h6>{title}</h6> */}
              <Input.TextArea
                rows={4}
                name={locale}
                value={shortDesc[locale] ?? "en"}
                onChange={(e) => onChange(e.target.name, e.target.value)}
              />
            </div>
          ))}
      </div>
      <div className="form__item longdesc">
        <Flex alignItems="center" className="mb-2" justifyContent="between">
          <h5>
            <IntlMessage id="applications.LongDescription" />
          </h5>
          <div className="ml-2 mb-1">
            <Select
              defaultValue={globalLanguage}
              onChange={(e) => setLongDescLang(e)}
            >
              {fields.map(({ title, locale }) => (
                <Select.Option value={locale} key={locale}>
                  {title}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Flex>
        {selectedLongDesc &&
          selectedLongDesc.map(({ title, locale }) => (
            <div key={locale} className="mb-3">
              {/* <h4>{title}</h4> */}
              <TextEditor
                apps={longDesc[locale] ?? ""}
                handleEditorChange={(content: string) => {
                  setLongDesc((prevState: Partial<ILocale>) => ({
                    ...prevState,
                    [locale]: content,
                  }));
                }}
              />
            </div>
          ))}
      </div>
    </>
  );
};
export default BasicEdit;

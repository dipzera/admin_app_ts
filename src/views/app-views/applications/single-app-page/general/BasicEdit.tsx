import { Form, Input, Select } from "antd";
import { lang } from "../../../../../assets/data/language.data.json";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextEditor from "../TextEditor";
import Flex from "../../../../../components/shared-components/Flex";
import { IState } from "../../../../../redux/reducers";
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
    app,
    longDesc,
    setLongDesc,
    setShortDesc,
    shortDesc,
}: any) => {
    const fields = [
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
    const globalLanguage = useSelector(
        (state: IState) => state["theme"].locale
    );
    const [shortDescLang, setShortDescLang] = useState(globalLanguage);
    const [longDescLang, setLongDescLang] = useState(globalLanguage);
    const [selectedShortDesc, setSelectedShortDesc] = useState<any>();
    const [selectedLongDesc, setSelectedLongDesc] = useState<any>();
    const onChange = (name: any, value: any) => {
        setShortDesc((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };
    useEffect(() => {
        setSelectedShortDesc(
            fields.filter(({ locale }) => shortDescLang == locale)
        );
        setSelectedLongDesc(
            fields.filter(({ locale }) => longDescLang == locale)
        );
    }, [lang, longDescLang]);

    return (
        <>
            <Form.Item name="Name" label="Application name" rules={rules.name}>
                <Input />
            </Form.Item>
            <div className="form__item shortdesc mb-3">
                <Flex
                    alignItems="center"
                    className="mb-2"
                    justifyContent="between"
                >
                    <h5>Short description</h5>
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
                    selectedShortDesc.map(({ title, locale }: any) => (
                        <div key={locale}>
                            {/* <h6>{title}</h6> */}
                            <Input.TextArea
                                rows={4}
                                name={locale}
                                value={shortDesc ? shortDesc[locale] : null}
                                onChange={(e) =>
                                    onChange(e.target.name, e.target.value)
                                }
                            />
                        </div>
                    ))}
            </div>
            <div className="form__item longdesc">
                <Flex
                    alignItems="center"
                    className="mb-2"
                    justifyContent="between"
                >
                    <h5>Long description</h5>
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
                    selectedLongDesc.map(({ title, locale }: any) => (
                        <div key={locale} className="mb-3">
                            {/* <h4>{title}</h4> */}
                            <TextEditor
                                apps={longDesc ? longDesc[locale] : null}
                                handleEditorChange={(e: any) =>
                                    setLongDesc((prevState: any) => ({
                                        ...prevState,
                                        [locale]: e,
                                    }))
                                }
                            />
                        </div>
                    ))}
            </div>
        </>
    );
};
export default BasicEdit;

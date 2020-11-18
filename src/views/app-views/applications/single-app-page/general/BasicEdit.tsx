import { Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextEditor from "../TextEditor";

const BasicEdit = ({ app, setLongDesc, setShortDesc, rules, shortDesc }) => {
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

    // const locale = useSelector((state) => state["theme"].locale);

    const [inputValues, setInputValues] = useState<any>();

    const onChange: any = (name, value) => {
        // setShortDesc((values) => [{ ...values }, { text: value, lang: name }]);
        // setShortDesc((values) => [{ ...values }, { text: value, lang: name }]);
        // setShortDesc((prevState) => ({ ...prevState, [name]: value }));
        // setShortDesc((prevState) => [{ lang: name, text: value }]);
        // setShortDesc((prevState) => ({
        //     ...prevState,
        //     [name]: { lang: name, text: value },
        // }));
        // setShortDesc({ [name]: [{ lang: name, text: value }] });
        // setShortDesc((prevState) => [
        //     prevState.map((desc) => {
        //         if (desc.lang !== name) {
        //             return desc;
        //         }
        //         return { lang: name, text: value };
        //     }),
        //     { lang: name, text: value },
        // ]);
        setShortDesc((prevState) => [
            ...prevState,
            { lang: name, text: value },
        ]);
    };

    useEffect(() => {
        console.log(shortDesc);
        // console.log(
        //     ...shortDesc
        //         .filter((desc) => desc.lang == locale)
        //         .map((desc) => desc.text)
        // );
    }, []);

    return (
        <>
            <Form.Item name="Name" label="Application name" rules={rules.name}>
                <Input />
            </Form.Item>

            <Form.Item label="Short Description">
                {fields.map(({ title, locale }) => (
                    <div key={locale}>
                        <h6>{title}</h6>
                        <Input.TextArea
                            rows={4}
                            name={locale}
                            // value={shortDesc
                            //     .filter((desc) => desc.lang == locale)
                            //     .map((desc) => desc.text)
                            //     .toString()}
                            onChange={(e) =>
                                onChange(e.target.name, e.target.value)
                            }
                        />
                    </div>
                ))}
                {/* {inputs.map(({ locale, title }) => (
                    <div key={locale}>
                        <h6>{title}</h6>
                        <Input.TextArea rows={4} value={app.ShortDescription} />
                    </div>
                ))} */}
            </Form.Item>
            {/* <h6>Russian</h6>
                <Input.TextArea
                    rows={4}
                    value={app.ShortDescription}
                    onChange={(content) => {
                        setShortDesc({
                            lang: "ru",
                            text: content.target.value,
                        });
                    }}
                /> */}
            <Form.Item
                // name="LongDescription"
                label="Long description"
                rules={rules.LongDescription}
            >
                <TextEditor
                    apps={app.LongDescription}
                    handleEditorChange={(content) => setLongDesc(content)}
                />
            </Form.Item>
        </>
    );
};
export default BasicEdit;

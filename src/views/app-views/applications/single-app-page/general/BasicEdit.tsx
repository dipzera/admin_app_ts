import { Form, Input, Select } from "antd";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextEditor from "../TextEditor";
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
const BasicEdit = ({ app, longDesc, setLongDesc, setShortDesc, shortDesc }) => {
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

    const onChange: any = (name, value) => {
        setShortDesc((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

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
                            value={shortDesc ? shortDesc[locale] : null}
                            onChange={(e) =>
                                onChange(e.target.name, e.target.value)
                            }
                        />
                    </div>
                ))}
            </Form.Item>
            <Form.Item label="Long description" rules={rules.LongDescription}>
                {fields.map(({ title, locale }) => (
                    <div key={locale} className="mb-3">
                        <h4>{title}</h4>
                        <TextEditor
                            apps={longDesc ? longDesc[locale] : null}
                            handleEditorChange={(e) =>
                                setLongDesc((prevState) => ({
                                    ...prevState,
                                    [locale]: e,
                                }))
                            }
                        />
                    </div>
                ))}
            </Form.Item>
        </>
    );
};
export default BasicEdit;

import { Button, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import TextEditor from "./TextEditor";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateMarketApp } from "../../../../redux/actions/Applications";

const textarea = [
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
const TermsOfUse = ({ app }) => {
    const [edit, setEdit] = useState(false);
    const [terms, setTerms] = useState<any>();
    const locale = useSelector((state) => state["theme"].locale);
    const dispatch = useDispatch();
    useEffect(() => {
        try {
            setTerms(JSON.parse(window.atob(app.TermsOfUse)));
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
        } = app;
        const App = {
            ID,
            LongDescription,
            Name,
            ShortDescription,
            Status,
            Photo,
            TermsOfUse: Buffer.from(JSON.stringify(terms)).toString("base64"),
        };
        dispatch(updateMarketApp(App));
        setEdit(false);
    };
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-2">
                <h2 className="mb-4" style={{ visibility: "hidden" }}>
                    Terms of use
                </h2>
                <div>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setEdit(!edit)}
                        />
                    </Tooltip>
                </div>
            </Flex>
            {edit ? (
                <>
                    {textarea.map(({ title, locale }) => (
                        <div key={locale} className="mb-3">
                            <h4>{title}</h4>
                            <TextEditor
                                apps={terms ? terms[locale] : null}
                                handleEditorChange={(content) => {
                                    setTerms((prevState) => ({
                                        ...prevState,
                                        [locale]: content,
                                    }));
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        type="ghost"
                        className="mr-2"
                        onClick={() => setEdit(false)}
                    >
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
                            __html: terms ? terms[locale] : null,
                        }}
                    ></p>
                </>
            )}
        </>
    );
};
export default TermsOfUse;

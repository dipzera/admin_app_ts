import { Button, Empty, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import TextEditor from "./TextEditor";
import { EditOutlined } from "@ant-design/icons";
import Axios from "axios";
import { API_IS_APP_SERVICE } from "../../../../constants/ApiConstant";
import { useDispatch, useSelector } from "react-redux";
import { updateMarketApp } from "../../../../redux/actions/Applications";
import utils from "../../../../utils";

const TermsOfUse = ({ app }) => {
    const [edit, setEdit] = useState(false);
    const [termsOfUse, setTermsOfUse] = useState<
        any
    >(); /* Further this will be an Array of {text, locale} and I will show the one based on the chosen language  */
    const [ruTerms, setRuTerms] = useState<any>();
    const [roTerms, setRoTerms] = useState<any>();
    const [enTerms, setEnTerms] = useState<any>();
    const [terms, setTerms] = useState<any>([ruTerms, roTerms, enTerms]);
    const Token = useSelector((state) => state["auth"].token);
    const locale = useSelector((state) => state["theme"].locale);
    const dispatch = useDispatch();
    const textarea = [
        {
            title: "English",
            locale: "en",
            setter: setEnTerms,
        },
        {
            title: "Romanian",
            locale: "ro",
            setter: setRoTerms,
        },
        {
            title: "Russian",
            locale: "ru",
            setter: setRuTerms,
        },
    ];
    const onFinish = () => {
        const {
            ID,
            LongDescription,
            Name,
            ShortDescription,
            Status,
            Photo,
        } = app;
        const termsToSend = JSON.stringify([enTerms, ruTerms, roTerms]);
        const App = {
            ID,
            LongDescription,
            Name,
            ShortDescription,
            Status,
            Photo,
            TermsOfUse: Buffer.from(termsToSend).toString("base64"),
        };
        setTerms([enTerms, ruTerms, roTerms]);
        dispatch(updateMarketApp(App, Token));
        setEdit(false);
    };
    useEffect(() => {
        console.log(JSON.parse(atob(app.TermsOfUse)));
        // console.log(
        //     JSON.parse(atob(app.TermsOfUse)).filter((elm) => elm.lang == locale)
        // );
    }, []);
    return (
        <>
            <Flex justifyContent="between" alignItems="center" className="py-2">
                <h2 className="mb-4">Terms of use</h2>
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
                    {textarea.map(({ title, locale, setter }) => (
                        <div key={locale} className="mb-3">
                            <h4>{title}</h4>
                            <TextEditor
                                apps={JSON.parse(atob(app.TermsOfUse))
                                    .filter((term) => term.lang == locale)
                                    .map((elm) => elm.text)
                                    .toString()}
                                handleEditorChange={(content) => {
                                    setter({
                                        lang: locale,
                                        text: content,
                                    });
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
                            __html:
                                "string" /* JSON.parse(atob(app.TermsOfUse))
                                .filter((term) => term.lang == locale)
                                .map((elm) => elm.text) */,
                        }}
                    ></p>
                </>
            )}
        </>
    );
};
export default TermsOfUse;

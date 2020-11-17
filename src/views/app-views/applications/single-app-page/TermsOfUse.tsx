import { Button, Empty, Tooltip } from "antd";
import React, { useState } from "react";
import Flex from "../../../../components/shared-components/Flex";
import TextEditor from "./TextEditor";
import { EditOutlined } from "@ant-design/icons";
import Axios from "axios";
import { API_IS_APP_SERVICE } from "../../../../constants/ApiConstant";
import { useDispatch, useSelector } from "react-redux";
import { updateMarketApp } from "../../../../redux/actions/Applications";

const TermsOfUse = ({ app }) => {
    const [edit, setEdit] = useState(false);
    const [termsOfUse, setTermsOfUse] = useState(app.TermsOfUse);
    const Token = useSelector((state) => state["auth"].token);
    const dispatch = useDispatch();
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
            TermsOfUse: termsOfUse,
        };
        dispatch(updateMarketApp(App, Token));
        setEdit(false);
    };
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
                    <TextEditor
                        apps={app.TermsOfUse}
                        handleEditorChange={(content) => setTermsOfUse(content)}
                    />
                    <Button type="primary" className="mt-3" onClick={onFinish}>
                        Save
                    </Button>
                </>
            ) : (
                <>
                    <p dangerouslySetInnerHTML={{ __html: app.TermsOfUse }}></p>
                </>
            )}
        </>
    );
};
export default TermsOfUse;

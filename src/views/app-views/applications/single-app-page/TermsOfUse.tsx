import { Empty } from "antd";
import React from "react";

const TermsOfUse = ({ app }) => {
    return (
        <>
            <h2 className="mb-4">Terms of use</h2>
            {app.TermsOfUse ? (
                <p dangerouslySetInnerHTML={{ __html: app.TermsOfUse }}></p>
            ) : (
                <Empty />
            )}
        </>
    );
};
export default TermsOfUse;

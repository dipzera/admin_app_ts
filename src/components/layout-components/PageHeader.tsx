import React from "react";
import AppBreadcrumb from "./AppBreadcrumb";
import IntlMessage from "../util-components/IntlMessage";

export const PageHeader = ({
    title,
    display,
}: {
    [key: string]: string | boolean;
}) => {
    return display ? (
        <div className="app-page-header">
            <h3 className="mb-0 mr-3 font-weight-semibold">
                <IntlMessage id={title ? title : ""} />
            </h3>
            <AppBreadcrumb />
        </div>
    ) : null;
};

export default PageHeader;

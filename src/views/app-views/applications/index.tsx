import React, { lazy, useEffect, useLayoutEffect, useState } from "react";
import AppList from "./AppList";
import axios from "axios";
import { API_IS_APP_SERVICE } from "../../../constants/ApiConstant";
import { connect, useDispatch, useSelector } from "react-redux";
import Utils from "../../../utils";
import { signOut } from "../../../redux/actions/Auth";
import { getMarketApps } from "../../../redux/actions/Applications";
import { Route } from "react-router-dom";
import { APP_PREFIX_PATH } from "../../../configs/AppConfig";

const Applications = ({ getMarketApps, signOut, Token, apps }) => {
    useEffect(() => {
        getMarketApps(Token);
    }, []);
    return (
        <>
            <AppList apps={apps} setApps={signOut} signOut={signOut} />
        </>
    );
};
const mapStateToProps = ({ auth, apps }) => {
    const { token: Token } = auth;
    return { Token, apps };
};
export default connect(mapStateToProps, { signOut, getMarketApps })(
    Applications
);

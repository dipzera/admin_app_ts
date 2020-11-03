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
import Loading from "../../../components/shared-components/Loading";

const Applications = ({ getMarketApps, signOut, Token, apps, loading }) => {
    useEffect(() => {
        getMarketApps(Token);
    }, []);
    return (
        <>{loading ? <Loading /> : <AppList apps={apps} signOut={signOut} />}</>
    );
};
const mapStateToProps = ({ auth, apps }) => {
    const { token: Token, loading } = auth;
    return { Token, apps };
};
export default connect(mapStateToProps, { signOut, getMarketApps })(
    Applications
);

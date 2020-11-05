import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";
import { APP_PREFIX_PATH } from "../../configs/AppConfig";

export const AppViews = () => {
    return (
        <Suspense fallback={<Loading cover="content" />}>
            <Switch>
                <Route
                    path={`${APP_PREFIX_PATH}/wizard`}
                    component={lazy(() => import(`./catalog/company/wizard`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/dashboard`}
                    component={lazy(() => import(`./dashboard`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/applications`}
                    exact
                    component={lazy(() => import(`./applications`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/applications/:appID`}
                    component={lazy(
                        () => import(`./applications/SingleAppPage`)
                    )}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/catalog/companies`}
                    component={lazy(() => import(`./catalog/company`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/catalog/users`}
                    component={lazy(() => import(`./catalog/users/UserList`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/catalog/group`}
                    component={lazy(() => import(`./catalog/group`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/security/history`}
                    component={lazy(() => import(`./security/history`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/security/rules`}
                    component={lazy(() => import(`./security/rules`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/audit`}
                    component={lazy(() => import(`./audit/all`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/audit/login-history`}
                    component={lazy(() => import(`./audit/login-history`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/audit/actions`}
                    component={lazy(() => import(`./audit/actions`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/reports`}
                    component={lazy(() => import(`./reports`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/invoices`}
                    component={lazy(() => import(`./financial/invoices`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/payments`}
                    component={lazy(() => import(`./financial/payments`))}
                />
                <Route
                    path={`${APP_PREFIX_PATH}/settings`}
                    component={lazy(() => import(`./account-settings`))}
                />
                <Redirect
                    from={`${APP_PREFIX_PATH}`}
                    to={`${APP_PREFIX_PATH}/dashboard`}
                />
            </Switch>
        </Suspense>
    );
};

export default React.memo(AppViews);

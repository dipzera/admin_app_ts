import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from "../../components/shared-components/Loading";
import { AUTH_PREFIX_PATH } from "../../configs/AppConfig";

export const AuthViews = () => {
    return (
        <Suspense fallback={<Loading cover="page" />}>
            <Switch>
                <Route
                    path={`${AUTH_PREFIX_PATH}/login`}
                    component={lazy(() => import(`./authentication/login`))}
                />
                <Route
                    path={`${AUTH_PREFIX_PATH}/forgot-password`}
                    component={lazy(
                        () => import(`./authentication/forgot-password`)
                    )}
                />
                <Route
                    path={`${AUTH_PREFIX_PATH}/404`}
                    component={lazy(() => import(`./errors/error-page-1`))}
                />

                <Redirect
                    from={`${AUTH_PREFIX_PATH}`}
                    to={`${AUTH_PREFIX_PATH}/login`}
                />
            </Switch>
        </Suspense>
    );
};

export default AuthViews;

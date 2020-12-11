import { message } from "antd";
import { AdminApi } from "../../api";
import { DONE } from "../../constants/Messages";
import WithStringTranslate from "../../utils/translate";
import { SET_APPS } from "../constants/Applications";
import { ThunkResult } from "../reducers";
import { IApps, IPackages } from "../reducers/Applications";
import { hideLoading, showLoading } from "./Auth";

const setApps = (payload: IApps) => ({
    type: SET_APPS,
    payload,
});

export const getMarketApps = (): ThunkResult<void> => async (dispatch) => {
    dispatch(showLoading());
    return new AdminApi().GetMarketAppList().then((data: any) => {
        dispatch(hideLoading());
        if (data) {
            const { ErrorCode, ErrorMessage, MarketAppList } = data;
            if (ErrorCode === 0) dispatch(setApps(MarketAppList));
        }
    });
};
export const updateMarketApp = (App: {
    [key: string]: any;
}): ThunkResult<void> => async (dispatch) => {
    return new AdminApi().UpdateMarketApp(App).then(async (data: any) => {
        if (data) {
            if (data.ErrorCode === 0) {
                await dispatch(getMarketApps());
                message.success({
                    content: WithStringTranslate(DONE),
                    key: "updatable",
                    duration: 1,
                });
            }
        }
    });
};

export const createMarketAppPackage = (
    middlewareData: { [key: string]: any },
    MarketAppID: number
): ThunkResult<void> => async (dispatch) => {
    dispatch(showLoading());
    return new AdminApi()
        .CreateMarketAppPackage(middlewareData, MarketAppID)
        .then(async (data: any) => {
            dispatch(hideLoading());
            if (data) {
                if (data.ErrorCode === 0) {
                    await dispatch(getMarketApps());
                    message.success({
                        content: WithStringTranslate(DONE),
                        key: "updatable",
                        duration: 1,
                    });
                }
            }
        });
};
export const updateMarketAppPackage = (
    AppPackage: IPackages
): ThunkResult<void> => async (dispatch) => {
    dispatch(showLoading());
    return new AdminApi()
        .UpdateMarketAppPackage(AppPackage)
        .then(async (data: any) => {
            dispatch(hideLoading());
            if (data) {
                if (data.ErrorCode === 0) {
                    await dispatch(getMarketApps());
                    message.success({
                        content: WithStringTranslate(DONE),
                        key: "updatable",
                        duration: 1,
                    });
                }
            }
        });
};

export const deleteMarketAppPackage = (ID: number): ThunkResult<void> => async (
    dispatch
) => {
    dispatch(showLoading());
    return new AdminApi().DeleteMarketAppPackage(ID).then(async (data: any) => {
        dispatch(hideLoading());
        if (data) {
            if (data.ErrorCode === 0) {
                await dispatch(getMarketApps());
                message.success({
                    content: WithStringTranslate(DONE),
                    key: "updatable",
                    duration: 1,
                });
            }
        }
    });
};

export const changeMarketAppStatus = (
    AppID: number,
    Status: number
): ThunkResult<void> => async (dispatch) => {
    dispatch(showLoading());
    setTimeout(() => {
        dispatch(hideLoading());
        return new AdminApi()
            .ChangeMarketAppStatus(AppID, Status)
            .then((data: any) => {
                if (data) {
                    if (data.ErrorCode === 0) {
                        message.success({
                            content: WithStringTranslate(DONE),
                            key: "updatable",
                            duration: 1,
                        });
                        dispatch(getMarketApps());
                    }
                }
            });
    }, 1000);
};

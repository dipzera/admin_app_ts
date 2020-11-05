import { message } from "antd";
import Axios from "axios";
import { API_IS_APP_SERVICE } from "../../constants/ApiConstant";
import { EXPIRE_TIME } from "../../constants/Messages";
import { SET_APPS } from "../constants/Applications";
import { hideLoading, showLoading, signOut } from "./Auth";

export const setApps = (payload) => ({
    type: SET_APPS,
    payload,
});
export const getMarketApps = (Token) => async (dispatch) => {
    dispatch(showLoading());
    Axios.get(`${API_IS_APP_SERVICE}/GetMarketAppList`, {
        params: {
            Token,
        },
    }).then((res) => {
        dispatch(hideLoading());
        const { ErrorCode, ErrorMessage, MarketAppList } = res.data;
        console.log(res.data);
        if (ErrorCode === 0) {
            dispatch(setApps(MarketAppList));
        } else if (ErrorCode === 118) {
            message.loading(EXPIRE_TIME, 1.5).then(() => dispatch(signOut()));
        }
    });
};

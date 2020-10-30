import Axios from "axios";
import { API_IS_APP_SERVICE } from "../../constants/ApiConstant";
import { SET_APPS } from "../constants/Applications";
import { signOut } from "./Auth";

export const setApps = (payload) => ({
    type: SET_APPS,
    payload,
});
export const getMarketApps = (Token) => async (dispatch) => {
    Axios.get(`${API_IS_APP_SERVICE}/GetMarketAppList`, {
        params: {
            Token,
        },
    }).then((res) => {
        const { ErrorCode, ErrorMessage, MarketAppList } = res.data;
        console.log(res.data);
        if (ErrorCode === 0) {
            dispatch(setApps(MarketAppList));
        } else if (ErrorCode === 118) {
            dispatch(signOut());
        }
    });
};

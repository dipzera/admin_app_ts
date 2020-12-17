import { combineReducers } from "redux";
import Auth, { IAuth } from "./Auth";
import Theme, { ITheme } from "./Theme";
import Account, { IAccount } from "./Account";
import Applications from "./Applications";
import { ThunkAction } from "redux-thunk";
import { IMarketAppList } from "../../api/types.response";
export type ThunkResult<R> = ThunkAction<
    R,
    IState,
    undefined,
    any
>; /* Replace any with a type object for Actions */
export interface IState {
    theme: ITheme;
    account: IAccount;
    auth: IAuth;
    apps?: IMarketAppList[];
}
const reducers = combineReducers({
    theme: Theme,
    auth: Auth,
    account: Account,
    apps: Applications,
});

export default reducers;

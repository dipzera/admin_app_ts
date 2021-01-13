import { combineReducers } from "redux";
import Auth, { IAuth } from "./Auth";
import Theme, { ITheme } from "./Theme";
import Account, { IAccount } from "./Account";
import { ThunkAction } from "redux-thunk";
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
}
const reducers = combineReducers({
  theme: Theme,
  auth: Auth,
  account: Account,
});

export default reducers;

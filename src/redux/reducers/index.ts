import { combineReducers } from "redux";
import Auth from "./Auth";
import Theme from "./Theme";
import Account from "./Account";
import Applications from "./Applications";

const reducers = combineReducers({
    theme: Theme,
    auth: Auth,
    account: Account,
    apps: Applications,
});

export default reducers;

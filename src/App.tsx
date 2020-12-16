import * as React from "react";
import Views from "./views/index";
import { Route, Switch } from "react-router-dom";

const App: React.FC = () => {
    return (
        <Switch>
            <Route path="/" component={Views} />
        </Switch>
    );
};

export default App;

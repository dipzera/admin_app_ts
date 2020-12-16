import * as React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import { unregister } from "./serviceWorker";
import store from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SUBDIR_PATH } from "./configs/AppConfig";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();

const render = (Component: any) => {
    return ReactDOM.render(
        <div className="App">
            <Provider store={store}>
                <BrowserRouter basename={SUBDIR_PATH}>
                    <Component />
                </BrowserRouter>
            </Provider>
        </div>,
        document.getElementById("root")
    );
};

render(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        const NextApp = require("./App").default;
        render(NextApp);
    });
}

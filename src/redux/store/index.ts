import { applyMiddleware, compose, createStore } from "redux";
import reducers, { IState } from "../reducers";
import { loadState, saveState } from "../../utils/localStorage";
import throttle from "lodash/throttle";
import thunk from "redux-thunk";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

// function configureStore(preLoadedState: any) {
//     const composeEnhancers =
//         window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//     return createStore(
//         reducers,
//         preLoadedState,
//         compose(applyMiddleware(thunk))
//     );
// }

let store: any;
const configureStore = (preLoadedState: any) => {
    store = createStore(
        reducers,
        preLoadedState,
        compose(applyMiddleware(thunk))
    );
    if (process.env.NODE_ENV !== "production") {
        if (module.hot) {
            module.hot.accept("../reducers", () => {
                store.replaceReducer(reducers);
            });
        }
    }
    return store;
};

store = configureStore(loadState());

store.subscribe(throttle(() => saveState(store.getState()), 1000));
export default store;

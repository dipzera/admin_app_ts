import {
  AUTHENTICATED,
  SHOW_AUTH_MESSAGE,
  HIDE_AUTH_MESSAGE,
  SHOW_LOADING,
  SIGNOUT,
  HIDE_LOADING,
} from "../constants/Auth";
export interface IAuth {
  loading?: boolean;
  message?: string;
  showMessage?: boolean;
  redirect?: string;
  token?: string;
  isAuth?: boolean;
}

const initState = {
  loading: false,
  message: "",
  showMessage: false,
  redirect: "",
  token: "",
  isAuth: false,
};

const auth = (state = initState, action: any) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        loading: false,
        redirect: "/",
        token: action.token,
        isAuth: true,
      };

    case SHOW_AUTH_MESSAGE:
      return {
        ...state,
        message: action.message,
        showMessage: true,
        loading: false,
      };
    case HIDE_AUTH_MESSAGE:
      return {
        ...state,
        message: "",
        showMessage: false,
      };
    case SIGNOUT:
      return {
        ...state,
        token: null,
        redirect: "/auth/login",
        loading: false,
        isAuth: false,
      };

    case SHOW_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case HIDE_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default auth;

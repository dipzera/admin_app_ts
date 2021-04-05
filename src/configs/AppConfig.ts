import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE } from "../constants/ThemeConstant";
import { env } from "./EnvironmentConfig";

export const APP_NAME = "Admin Portal App";
export const API_APP_URL = env!.API_APP_URL;
export const DOMAIN = env!.DOMAIN;
export const CLIENT_URL = env!.CLIENT_URL;
export const API_AUTH_URL = env!.API_AUTH_URL;
export const API_MAIL_URL = env!.API_MAIL_URL;
export const SUBDIR_PATH = env!.SUBDIR_PATH;
export const APP_PREFIX_PATH = "/app";
export const AUTH_PREFIX_PATH = "/auth";

interface ThemeConfigProps {
  navCollapsed?: boolean;
  sideNavTheme?: string;
  locale?: string;
  navType?: string;
  topNavColor?: string;
  headerNavColor?: string;
  mobileNav?: boolean;
}

export const THEME_CONFIG = {
  navCollapsed: false,
  sideNavTheme: SIDE_NAV_LIGHT,
  locale: "en",
  navType: NAV_TYPE_SIDE,
  topNavColor: "#fff",
  headerNavColor: "#193550",
  mobileNav: false,
} as ThemeConfigProps;

export interface APIProps {
    API_APP_URL: string;
    API_AUTH_URL: string;
}
const dev = {
    API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
};

const prod = {
    /* TODO: complete this when prod ready */
    API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
};

const test = {
    API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
};

const getEnv = (): APIProps | undefined => {
    switch (process.env.NODE_ENV) {
        case "development":
            return dev;
        case "production":
            return prod;
        case "test":
            return test;
        default:
            break;
    }
};

export const env = getEnv();

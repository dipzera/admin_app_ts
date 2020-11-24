const dev = {
    API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
    CLIENT_URL: "http://localhost:3001/clientportal",
};

const prod = {
    API_APP_URL: "https://api.edi.md/ISAdminWebAppServiceTest/json",
    API_AUTH_URL: "https://api.edi.md/ISAuthServiceTest/json",
    CLIENT_URL: "http://efactura.md/clientportal",
};

const test = {
    API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
    API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
};

const getEnv = (): any => {
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

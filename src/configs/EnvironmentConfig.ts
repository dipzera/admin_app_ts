const dev = {
  APP_ENV: "dev",
  API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  CLIENT_URL: "http://localhost.com:3001",
  API_MAIL_URL: "https://dev.edi.md/ISMailService/json",
  DOMAIN: "localhost.com",
  SUBDIR_PATH: "/adminportal",
};

const prod = {
  APP_ENV: "prod",
  API_APP_URL: "https://api.edi.md/ISAdminWebAppService/json",
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  CLIENT_URL: "https://client.eservicii.md",
  API_MAIL_URL: "https://api.edi.md/ISMailService/json",
  DOMAIN: "eservicii.md",
  SUBDIR_PATH: "/adminportal",
};

const test = {
  APP_ENV: "test",
  API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  CLIENT_URL: "https://test.eservicii.md",
  API_MAIL_URL: "https://dev.edi.md/ISMailService/json",
  DOMAIN: "eservicii.md",
  SUBDIR_PATH: "/testadminportal",
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

const dev = {
  API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  CLIENT_URL: "http://localhost:3001/clientportal",
  DOMAIN: "localhost.com",
  SUBDIR_PATH: "/adminportal",
};

const prod = {
  API_APP_URL: "https://api.edi.md/ISAdminWebAppService/json",
  API_AUTH_URL: "https://api.edi.md/ISAuthService/json",
  CLIENT_URL: "https://eservicii.md/clientportal",
  DOMAIN: "eservicii.md",
  SUBDIR_PATH: "/adminportal",
};

const test = {
  API_APP_URL: "https://dev.edi.md/ISAdminWebAppService/json",
  API_AUTH_URL: "https://dev.edi.md/ISAuthService/json",
  CLIENT_URL: "https://eservicii.md/testclientportal",
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

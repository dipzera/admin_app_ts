import { AxiosRequestConfig } from "axios";
import HttpService from "../";
import { API_MAIL_URL } from "../../configs/AppConfig";
import { TokenResponse } from "../types";
import { GetTemplates, SendMail, TemplatesType } from "./types";

export class MailService extends HttpService {
  public constructor() {
    super(API_MAIL_URL);
    this.instance.interceptors.request.use(this._interceptRequest);
  }

  private _interceptRequest = (config: AxiosRequestConfig) => {
    return {
      ...config,
      auth: { username: "1", password: "1" },
    };
  };

  public GetTemplates = async () =>
    this.instance.get<GetTemplates>("/GetTemplatesByToken");

  public UpdateTemplate = async (data: TemplatesType) =>
    this.instance.post<TokenResponse>("/UpdateTemplate", data);

  public SendMail = async (data: SendMail) =>
    this.instance.post<TokenResponse>("/SendMailByToken", data);
}

import HttpService from "../";
import { API_MAIL_URL } from "../../configs/AppConfig";
import { TokenResponse } from "../types";
import { GetTemplates, SendMail, Templates } from "./types";

export class MailService extends HttpService {
  constructor() {
    super(API_MAIL_URL);
  }

  public GetTemplates = async (APIKey: string) =>
    this.instance.get<GetTemplates>("/GetTemplates", { params: { APIKey } });

  public UpdateTemplate = async (data: Templates) =>
    this.instance.post<TokenResponse>("/UpdateTemplate", data);

  public SendMail = async (data: SendMail) =>
    this.instance.post<TokenResponse>("/SendMail", data);
}

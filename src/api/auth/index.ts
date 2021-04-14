import HttpService from "../";
import { API_AUTH_URL } from "../../configs/AppConfig";
import { IAccount } from "../../redux/reducers/Account";
import { IUser } from "../app/types";
import { ApiDecorator, ApiResponse } from "../types";
const publicIp = require("react-public-ip");
export class AuthService extends HttpService {
  public constructor() {
    super(`${API_AUTH_URL}`);
  }

  public Login = async (Email: string, Password: string) =>
    this.instance.post<ApiDecorator<ApiResponse, "Token", string>>(
      "/AuthorizeUser",
      {
        Email,
        Password,
        info: (await publicIp.v4()) || ("" as string),
      }
    );

  public GetProfileInfo = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "User", IUser>>(
      "/GetProfileInfo"
    );

  public SendActivationCode = async (UserID?: number) =>
    this.instance.get<ApiResponse>("/SendActivationCode", {
      params: { UserID },
    });

  public ResetPassword = async (Email: string) =>
    this.instance.post<ApiResponse>("/ResetPassword", {
      Email,
      info: (await publicIp.v4()) || "",
    });

  public RegisterUser = async (data: IAccount) =>
    this.instance.post<ApiResponse>("/RegisterUser", {
      ...data,
    });

  public GetManagedToken = async (CompanyID: number) =>
    this.instance.get<ApiDecorator<ApiResponse, "Token", string>>(
      "/GetManagedToken",
      {
        params: { CompanyID },
      }
    );

  public ChangePassword = async (NewPassword: string, OldPasword: string) =>
    this.instance.post<ApiResponse>("/ChangePassword", {
      NewPassword,
      OldPasword,
    });

  public ActivateUser = async (Token: string) =>
    this.instance.get<ApiResponse>("/ActivateUser", {
      params: { Token },
    });
}

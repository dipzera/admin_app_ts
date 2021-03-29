import HttpService from "..";
import { API_APP_URL } from "../../configs/AppConfig";
import { IAccount } from "../../redux/reducers/Account";
import { ApiRequest, ApiDecorator, ApiResponse } from "../types";
import { CreateMarketPackage } from "./types";
import {
  IAppPackage,
  IBasicCompanyList,
  ICompanyData,
  IMarketAppList,
  INewsList,
  IUser,
  IUsers,
} from "./types";
const publicIp = require("react-public-ip");

export class AppService extends HttpService {
  public constructor() {
    super(`${API_APP_URL}`);
  }

  public GetAllUsers = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "Users", IUsers[]>>(
      "/GetAllUsersInfo"
    );

  public GetCompanyList = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "CompanyList", ICompanyData[]>>(
      "/GetCompanyList"
    );

  public GetBasicCompanyList = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "CompanyList", IBasicCompanyList[]>
    >("/GetBasicCompaniesList");

  public ChangeCompanyStatus = async (ID: number, Status: number) =>
    this.instance.get<ApiResponse>("/ChangeCompanyStatus", {
      params: {
        ID,
        Status,
      },
    });

  public ChangeUserStatus = async (ID: number, Status: number) =>
    this.instance.get<ApiResponse>("/ChangeUserStatus", {
      params: {
        ID,
        Status,
      },
    });
  public UpdateUser = async (data: IAccount) =>
    this.instance.post<ApiResponse>("/UpdateUser", {
      User: {
        ...data,
      },
    });

  public RegisterClientCompany = async (data: ICompanyData) =>
    this.instance.post<ApiDecorator<ApiResponse, "CompanyID", number>>(
      "/RegisterClientCompany",
      {
        Company: {
          ...data,
        },
        info: (await publicIp.v4()) || "",
      }
    );

  public UpdateCompany = async (
    data: ApiDecorator<ApiRequest, "Company", ICompanyData>
  ) =>
    this.instance.post("/UpdateCompany", {
      ...data,
      info: (await publicIp.v4()) || "",
    });

  public GetCompanyInfo = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "Company", ICompanyData>>(
      "/GetCompanyInfo"
    );

  public GetMarketAppList = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "MarketAppList", IMarketAppList[]>
    >("/GetMarketAppList");

  public UpdateMarketApp = async (App: IMarketAppList) =>
    this.instance.post<ApiResponse>("/UpdateMarketApp", {
      App,
    });

  public CreateMarketAppPackage = async (data: CreateMarketPackage) =>
    this.instance.post("/CreateMarketAppPackage", data);

  public UpdateMarketAppPackage = async (AppPackages: IAppPackage[]) =>
    this.instance.post<ApiResponse>("/UpdateMarketAppPackage", {
      AppPackages,
    });

  public DeleteMarketAppPackage = async (ID: number) =>
    this.instance.post<ApiResponse>("/DeleteMarketAppPackage", {
      ID,
    });

  public ChangeMarketAppStatus = async (ID: number, Status: number) =>
    this.instance.get<ApiResponse>("/ChangeMarketAppStatus", {
      params: { ID, Status },
    });

  public GetNews = async (ProductType: number) =>
    this.instance.get<ApiDecorator<ApiResponse, "NewsList", INewsList[]>>(
      "/GetNews",
      {
        params: {
          ProductType,
        },
      }
    );

  public UpdateNews = async (NewsData: any) =>
    this.instance.post<ApiResponse>("/UpdateNews", {
      NewsData,
    });
}

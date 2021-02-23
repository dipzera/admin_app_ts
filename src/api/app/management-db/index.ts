import HttpService from "../..";
import { API_APP_URL } from "../../../configs/AppConfig";
import { ApiDecorator, ApiResponse } from "../../types";
import {
  IDatabases,
  IDbInstance,
  IDbInstances,
  IDbService,
  IDbServices,
  IServiceInstance,
  IServiceInstances,
} from "./types";

export class ManagementDb extends HttpService {
  constructor() {
    super(`${API_APP_URL}/ManagementDb`);
  }

  public GetDatabases = async (ServerID: number) =>
    this.instance.get<ApiResponse>(`/GetDatabases`, { params: { ServerID } });

  public GetDbInstance = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "DBInstances", IDbInstances[]>>(
      `/GetDatabaseInstances`
    );

  public GetDbServiceInstance = async () =>
    this.instance.get<ApiDecorator<ApiResponse, "DBServices", IDbServices[]>>(
      `/GetDataBaseServicesInstances`
    );

  public GetServiceInstances = async () =>
    this.instance.get<
      ApiDecorator<ApiResponse, "ServiceInstances", IServiceInstances[]>
    >(`/GetServicesInstances`);

  public UpdateDatabase = async (data: IDatabases) =>
    this.instance.post<ApiResponse>(`/UpdateDatabase`, data);

  public UpdateDatabaseInstance = async (data: IDbInstance) =>
    this.instance.post<ApiResponse>(`/UpdateDatabaseInstance`, data);

  public UpdateDatabaseServiceInstance = async (data: IDbService) =>
    this.instance.post<ApiResponse>(`/UpdateDataBaseServiceInstance`, data);

  public UpdateServiceInstance = async (data: IServiceInstance) =>
    this.instance.post<ApiResponse>(`/UpdateServiceInstance`, data);
}

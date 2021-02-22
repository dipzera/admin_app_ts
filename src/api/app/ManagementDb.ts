import { AppService } from ".";

export class ManagementDb extends AppService {
  service = "/ManagementDb";
  constructor() {
    super();
  }

  public GetDatabases = () => this.instance.get(`${this.service}/GetDatabases`);

  public GetDbInstance = () =>
    this.instance.get(`${this.service}/GetDbInstance`);

  public UpdateDbInstance = (data: any) =>
    this.instance.post(`${this.service}/UpdateDbInstance`, data);
}

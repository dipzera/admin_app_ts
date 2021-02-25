export interface IDbServices {
  ID: number;
  Notes: string;
  Password: string;
  State: number;
  Token: string;
  URI: string;
  UserName: string;
}
export interface IDatabases {
  Company: string;
  DBName: string;
  ID: number;
  Password: string;
  Token: string;
  User: string;
}
export interface IDbInstances {
  BackupPassword: string;
  BackupUser: string;
  ID: number;
  IP: string;
  Location: number;
  Name: string;
  OSType: number;
  Password: string;
  Port: string;
  State: number;
  Token: string;
  Type: number;
  User: string;
  DBServices?: IDbServices[];
  Databases?: IDatabases[];
}

export interface IDbInstance {
  BackupPassword: string;
  BackupUser: string;
  DBServiceID: number;
  ID: number;
  IP: string;
  Location: number;
  Name: string;
  OSType: number;
  Password?: string;
  Port: string;
  State: number;
  Token: string;
  Type: number;
  User?: string;
}

export interface IDbService {
  ID: number;
  Notes: string;
  State: number;
  Token?: string;
  URI: string;
}

export interface IServiceInstance extends IDbService {}

export interface IServiceInstances {
  ID: number;
  Notes: string;
  State: number;
  Token: string;
  URI: string;
  ServerIP: string;
  ServerName: string;
}
export enum EnOSType {
  LINUX = 0,
  WINDOWS = 1,
}
export enum EnServiceType {
  INDEFINITE = 0,
  EXPORT_SERVICE = 1,
  ECOMMERCE_SERVICE = 2,
  DATA_TERMINAL = 3,
  BILLS_WORKER_SERVICE = 4,
  AGENT_SERVICE = 5,
  RETAIL_EXCHANGE_SERVICE = 6,
  DB_SERVICE = 100,
}
export enum EnServiceState {
  NOT_ACTIVATED = 0,
  ACTIVATED = 1,
  BLOCKED = 2,
  DISABLED = 3,
}
export enum EnDbServerLocation {
  PUBLIC = 0,
  SAAS = 1,
  PRIVATE = 2,
}
export enum EnDbServerType {
  POSTGRESQL = 0,
  MICROSOFTSQL = 1,
  ORACLE = 2,
}
export enum EnDbServerState {
  NOT_ACTIVATED = 0,
  ACTIVATED = 1,
  BLOCKED = 2,
  DISABLED = 3,
}

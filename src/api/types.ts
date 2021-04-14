export type ApiDecorator<
  Obj,
  Key extends string | number | symbol,
  Value
> = Obj &
  {
    [prop in Key]: Value;
  };
export interface ApiRequest {
  Token?: string;
}
export interface ApiResponse {
  ErrorCode?: number;
  ErrorMessage?: string;
}
export type TokenResponse = ApiDecorator<ApiResponse, "Token", string>;

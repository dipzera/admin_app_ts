import { ApiDecorator, ApiResponse } from "../types";
export type Templates = {
  APIKey: string;
  Body: string;
  ID: number;
  Name: string;
  State: number;
  Subject: string;
};
export type GetTemplates = ApiDecorator<ApiResponse, "Templates", Templates>;

export type MailAttachments = {
  File: number[];
  MediaType: string;
  Name: string;
};
export type Mail = {
  Attachments: MailAttachments[];
  Body: string;
  Cc: string[];
  IsHtmlBody: boolean;
  NoReply: boolean;
  ReplyTo: string;
  Subject: string;
  To: string[];
};
export type SendMail = {
  APIKey: string;
  Action: string;
  Category: string;
  Mail: Mail;
  Parameters: string;
  SendEmailOnDate: any; // .NET date
  Source: string;
  Template: number;
};

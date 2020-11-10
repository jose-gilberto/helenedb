import { RequestType } from './Request';

export enum ResponseCode {
  Ok = 200,
  Error = 400,
}

export interface Response {
  code: ResponseCode;
  message: string;
  data: Record<string, unknown>;
  request: {
    query: string;
    type: RequestType;
  };
}

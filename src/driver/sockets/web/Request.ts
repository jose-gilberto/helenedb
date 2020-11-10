export enum RequestType {
  ExplainQuery,
  Query,
}

export interface Request {
  query: string;
  type: RequestType;
}

import { ObjectType, Field } from "type-graphql";

export enum Status {
  Queued = "Queued",
  InProgress = "In Progress",
  Complete = "Completed"

}
export interface IUrlCrawlUpdatePayload {
  url: string;
  status: string;
  totalScraped: number;
}


@ObjectType()
export class UrlCrawlUpdate {
  @Field(_type => String)
  url: string;

  @Field(_type => String)
  status: string;

  @Field(_type => String)
  totalScraped: number;
}

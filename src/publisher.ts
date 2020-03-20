import { PubSub } from "graphql-subscriptions";
import { Status } from "./crawler/crawler.types";
import { getTotalForDomain } from "./crawler/crawler.store";

export const pubsub = new PubSub();

export const publishMessage = async ({ message, payload }: { message: string; payload: any; }) => {
   await pubsub.publish(message, payload);
}

export const publishUrlCrawlUpdateForDomain = async ({ domain, url, status }: { domain: string, url: string, status: Status }) => {
    await pubsub.publish(domain, { url, status, totalScraped: getTotalForDomain(domain) });
}
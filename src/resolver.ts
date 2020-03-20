import {
    Resolver,
    Query,
    Mutation,
    Arg,
    Subscription,
    Root,
} from "type-graphql";
import { IUrlCrawlUpdatePayload, UrlCrawlUpdate } from "./crawler/crawler.types";
import { startCrawlOfDomain } from "./crawler/crawler";
import { getUrlsForDomain } from "./crawler/crawler.store";

@Resolver()
export class CrawlerResolver {

    @Mutation(_returns => Boolean, { description: "Start a domain crawl" })
    async startDomainCrawl(@Arg("domain") domainUrl: string): Promise<boolean> {
        startCrawlOfDomain(domainUrl);
        return true;
    }

    @Query(_returns => [String], { description: "Get urls for domain" })
    async getUrlsForDomain(
        @Arg("domainUrl") domainUrl: string,
        @Arg("skip") skip: number,
        @Arg("limit") limit: number
    ): Promise<string[] | undefined> {
        return getUrlsForDomain(domainUrl, skip, limit);
    }

    // tslint:disable-next-line:no-feature-envy
    @Subscription({
        topics: ({ args }) => args.domainUrl,
        description: "Subscribe to domain events"
    })
    subscribeToDomainCrawlEvents(
        @Arg("domainUrl") _domainUrl: string,
        @Root() { url, status, totalScraped }: IUrlCrawlUpdatePayload,
    ): UrlCrawlUpdate {
        return { url, status, totalScraped };
    }
}
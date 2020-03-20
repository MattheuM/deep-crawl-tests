import { Status } from "./crawler.types";
import { publishUrlCrawlUpdateForDomain } from "../publisher";

interface ICrawledDomains {
    [domainUrl: string]: {
        [url: string]: Status
    }
}
interface IDomainCrawlStats {
    [domainUrl: string]: {
        total: number
    }
}

let crawledDomains: ICrawledDomains = {};
let domainCrawlStats: IDomainCrawlStats = {};

export const addDomainToStore = (domainUrl: string) => {
    crawledDomains = {
        ...crawledDomains,
        [domainUrl]:
            {}
    }
    domainCrawlStats = {
        ...domainCrawlStats,
        [domainUrl]:
        {
            total:
                0
        }
    }
}
export const isDomainInStore = (domainUrl: string) =>  !!crawledDomains[domainUrl];

export const getCrawledDomains = () => crawledDomains;

export const getTotalForDomain = (domainUrl: string) => {
    return domainCrawlStats[domainUrl].total;
}

export const updateTotal = (domainUrl: string) => {
    if (domainCrawlStats[domainUrl]) {
        domainCrawlStats[domainUrl].total++;
    }

}

export const checkIfUrlCrawled = (domainUrl: string, pageUrl: string) => {
    if (!crawledDomains[domainUrl][pageUrl]) {
        return false;
    }
    switch (crawledDomains[domainUrl][pageUrl]) {
        case Status.Complete:
            return true;
        case Status.Queued:
            return false;
        case Status.InProgress:
            return false;
        default: return false;
    }
}

export const addCompleteLinksToDomain = async (domainUrl: string, links: string[]) => {
    links?.forEach(async (link) => {
        crawledDomains[domainUrl][link] = Status.Complete;
        await publishUrlCrawlUpdateForDomain({ domain: domainUrl, url: link, status: Status.Complete })
        updateTotal(domainUrl);
    });
}

export const addIncompleteLinksToStore = async (domainUrl: string, links: string[]) => {
    links?.forEach(async (link) => {
        if (!crawledDomains[domainUrl][link]) {
            crawledDomains[domainUrl][link] = Status.Queued
            await publishUrlCrawlUpdateForDomain({ domain: domainUrl, url: link, status: Status.Queued })
        }
    });
}

export const changeUrlStatusToInProgress = async (domainUrl: string, link: string) => {
    crawledDomains[domainUrl][link] = Status.InProgress
    await publishUrlCrawlUpdateForDomain({ domain: domainUrl, url: link, status: Status.InProgress })
}

export const getUrlsForDomain = (domainUrl: string, skip = 0, limit = 25) => {
    if (!crawledDomains[domainUrl]) {
        return [];
    }
    const keys = Object.keys(crawledDomains[domainUrl]);
    return keys.slice(skip, skip + limit);
}
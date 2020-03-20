import {  checkPageForLinks } from "./crawler.helpers";
import { addDomainToStore, isDomainInStore } from "./crawler.store";
import { crawlQueue } from "./crawler.queue";

export const startCrawlOfDomain = (domainUrl: string) => {
    if (isDomainInStore(domainUrl)) {
        return;
    }
    addDomainToStore(domainUrl);
    crawlQueue.push(async () => {
        await checkPageForLinks(domainUrl, domainUrl);
    });
}


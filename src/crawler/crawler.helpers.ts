import { checkIfUrlCrawled, addIncompleteLinksToStore, addCompleteLinksToDomain, changeUrlStatusToInProgress } from "./crawler.store";
import { getPuppeteerPage } from "./crawler.puppeteer";
import { crawlQueue } from "./crawler.queue";
import { Page } from "puppeteer";

export const navigateToPage = async (page: Page, url: string) =>
    page.goto(url, { waitUntil: "networkidle2" });

export const getLinksInPage = async (page: Page, selector: string): Promise<string[]> => {
    return page.evaluate((selector) => {
        const urls = [];
        // tslint:disable-next-line:no-for-each-push
        document.querySelectorAll(selector)?.forEach((val) => {
            const href = val.getAttribute("href");
            const url = new URL(href, document.baseURI).href
            urls.push(url);
        })
        return urls;
    }, selector);
}

export const checkPageForLinks = async (domainUrl: string, pageUrl: string) => {
    const hasBeenPreviouslyScraped = checkIfUrlCrawled(domainUrl, pageUrl);
    if (hasBeenPreviouslyScraped) {
        return;
    }
    await changeUrlStatusToInProgress(domainUrl, pageUrl);
    const links = await findAllLinks(pageUrl);
    await addIncompleteLinksToStore(domainUrl, links);
    await queueTaskForLinks(domainUrl, links);
    await addCompleteLinksToDomain(domainUrl, [pageUrl]);
}

const queueTaskForLinks = async (domainUrl: string, links: string[]) => {
    // tslint:disable-next-line:no-for-each-push
    links?.forEach(async (link) => {
        crawlQueue.push(async () => {
            await checkPageForLinks(domainUrl, link);
        });
    });
}

export const getSelectorForDomainUrl =
    (domainUrl: string) =>
        `a[href^='${domainUrl}'], a[href^='/'], a[href^='./'], a[href^='../']`


export const findAllLinks = async (domainUrl: string) => {
    const findInternalLinksOnPage = async (pageUrl: string) => {
        const page = await getPuppeteerPage()
        await navigateToPage(page, pageUrl);
        const selectorForDomain = getSelectorForDomainUrl(domainUrl);
        const linksOnPage =
            await getLinksInPage(
                page,
                selectorForDomain
            );

        return linksOnPage?.filter(n => n).filter(url => url.startsWith(url));

    }
    return findInternalLinksOnPage(domainUrl);
}
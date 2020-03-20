// tslint:disable-next-line:no-implicit-dependencies
import "reflect-metadata";
import { getCrawledDomains, addDomainToStore, addIncompleteLinksToStore, addCompleteLinksToDomain, changeUrlStatusToInProgress, getUrlsForDomain, getTotalForDomain, updateTotal, checkIfUrlCrawled, isDomainInStore } from '../crawler.store';
import { Status } from "../crawler.types";

const DOMAIN_URL = "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/";
const ROUTE_ONE = "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld";
const ROUTE_TWO = "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld123";
const ROUTE_THREE = "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld999";
const ROUTE_FOUR = "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld888";

jest.mock("../../publisher");

// tslint:disable-next-line:no-big-function
describe("puppeteer crawler store tests", () => {
    it("should add the domain to the store", async () => {
        addDomainToStore(DOMAIN_URL);
        const store = getCrawledDomains();
        expect(store).toEqual({
            [DOMAIN_URL]: {}
        });
    });

    it("should return if the the domain is in the store", async () => {
        addDomainToStore(DOMAIN_URL);
        expect(isDomainInStore(DOMAIN_URL)).toEqual(true);
    });
    // tslint:disable-next-line:no-big-function
    it("should add the incomplete links to the store with the correct structure", async () => {
        addDomainToStore(DOMAIN_URL);
        const links = [
            ROUTE_ONE,
            ROUTE_TWO,
            ROUTE_THREE,
            ROUTE_FOUR,
        ]
        await addIncompleteLinksToStore(DOMAIN_URL, links)
        const store = getCrawledDomains();
        expect(store).toEqual({
            [DOMAIN_URL]: {
                [ROUTE_ONE]: Status.Queued,
                [ROUTE_TWO]: Status.Queued,
                [ROUTE_THREE]: Status.Queued,
                [ROUTE_FOUR]: Status.Queued
            }
        });
    });
    // tslint:disable-next-line:no-big-function
    it("should add complete to the store with the correct structure", async () => {
        addDomainToStore(DOMAIN_URL);
        const links = [
            ROUTE_ONE,
            ROUTE_TWO,
            ROUTE_THREE,
            ROUTE_FOUR,
        ]
        await addIncompleteLinksToStore(DOMAIN_URL, links);
        await addCompleteLinksToDomain(DOMAIN_URL, links.slice(0, 2));
        const store = getCrawledDomains();
        expect(store).toEqual({
            [DOMAIN_URL]: {
                [ROUTE_ONE]: Status.Complete,
                [ROUTE_TWO]: Status.Complete,
                [ROUTE_THREE]: Status.Queued,
                [ROUTE_FOUR]: Status.Queued
            }
        });
    });
    it("should return if a url has been previously checked", async () => {
        addDomainToStore(DOMAIN_URL);
        const links = [
            ROUTE_ONE,
            ROUTE_TWO,
            ROUTE_THREE
        ]
        await addIncompleteLinksToStore(DOMAIN_URL, links);
        await addCompleteLinksToDomain(DOMAIN_URL, links.slice(0, 2));
        expect(checkIfUrlCrawled(DOMAIN_URL, ROUTE_TWO)).toEqual(true)
        expect(checkIfUrlCrawled(DOMAIN_URL, ROUTE_THREE)).toEqual(false)
    });
    it("should add change link status to InProgress within the store ", async () => {
        addDomainToStore(DOMAIN_URL);
        const links = [
            ROUTE_ONE,
            ROUTE_TWO,
        ]
        await addIncompleteLinksToStore(DOMAIN_URL, links);
        await changeUrlStatusToInProgress(DOMAIN_URL, ROUTE_TWO);
        const store = getCrawledDomains();
        expect(store).toEqual({
            [DOMAIN_URL]: {
                [ROUTE_ONE]: Status.Queued,
                [ROUTE_TWO]: Status.InProgress,
            }
        });
    });
    // tslint:disable-next-line:no-big-function
    it("should return urls respecting the skip and limit", async () => {
        addDomainToStore(DOMAIN_URL);
        const links = [
            ROUTE_ONE,
            ROUTE_TWO,
            ROUTE_THREE,
            ROUTE_FOUR,
        ]
        await addIncompleteLinksToStore(DOMAIN_URL, links);
        expect(getUrlsForDomain(DOMAIN_URL, 0, 1)).toEqual([
            ROUTE_ONE,
        ]);
        expect(getUrlsForDomain(DOMAIN_URL, 1, 3)).toEqual([
            ROUTE_TWO,
            ROUTE_THREE,
            ROUTE_FOUR,
        ]);
        expect(getUrlsForDomain(DOMAIN_URL, 2, 1)).toEqual([
            ROUTE_THREE,
        ]);
        expect(getUrlsForDomain(DOMAIN_URL, 3, 1)).toEqual([
            ROUTE_FOUR,
        ]);
    });
    it("should return the total for the domain", async () => {
        addDomainToStore(DOMAIN_URL);
        expect(getTotalForDomain(DOMAIN_URL)).toEqual(0)
    })
    it("should update the total for the domain", async () => {
        addDomainToStore(DOMAIN_URL);
        updateTotal(DOMAIN_URL);
        updateTotal(DOMAIN_URL);
        expect(getTotalForDomain(DOMAIN_URL)).toEqual(2);

    })
});
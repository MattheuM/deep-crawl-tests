// tslint:disable-next-line:no-implicit-dependencies
import "reflect-metadata";
import { getPuppeteerInstance } from "../crawler.puppeteer";
import { Browser } from "puppeteer";
import { getLinksInPage, getSelectorForDomainUrl, navigateToPage } from "../crawler.helpers";

let browser: Browser;

const domainUrl = "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/";

// tslint:disable-next-line:no-big-function
describe("puppeteer crawler helper tests", () => {

    beforeAll(async () => {
        browser = await getPuppeteerInstance();
    })

    afterAll(async () => {
        await browser.close();
    })

    it("should navigate to the next page", async () => {
        const page = await browser.newPage();
        await navigateToPage(page, domainUrl);
        expect(page).toMatch("Deep crawl test page");
    });
    it("should find the correct links on a page", async () => {
        const page = await browser.newPage();

        await page.goto(domainUrl);
        const selector = getSelectorForDomainUrl(domainUrl);
        const links = await getLinksInPage(page, selector);

        const expectedLinks = [
            "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld",
            "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld123",
            "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld999",
            "http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/helloWorld888",
        ];
        expect(links).toEqual(expectedLinks);
    });

    it("should return the correct selector for the domain", async () => {
        const selector = getSelectorForDomainUrl(domainUrl);
        expect(selector).toEqual("a[href^='http://deep-crawl-test-host.s3-website-eu-west-1.amazonaws.com/'], a[href^='/'], a[href^='./'], a[href^='../']")
    });


});
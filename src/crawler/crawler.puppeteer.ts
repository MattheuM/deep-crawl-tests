import { Page, Browser, launch } from "puppeteer";

let browser: Browser;

export const getPuppeteerInstance = async (): Promise<Browser> => {
    if (!browser) {
        browser = await launch({ headless: true });
    }
    return browser;
}

let puppeteerPage: Page;

export const getPuppeteerPage = async () => {
    if (!puppeteerPage) {
        puppeteerPage = await (await getPuppeteerInstance()).newPage();
    }
    return puppeteerPage;
}

import { queue } from 'async';
import { getPuppeteerPage } from './crawler.puppeteer';

export const crawlQueue = queue(async (task: any) => {
    try {
        await task();
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.log(error);
    }
}, 1);

crawlQueue.push(async () => {
    await getPuppeteerPage();
});

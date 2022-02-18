import * as Puppeteer from "puppeteer";
import { ApolloBrowser } from "#browsers/ApolloBrowser";

export class ApolloBrowserTab {
    readonly #browser: ApolloBrowser;
    readonly #puppeteerPage: Puppeteer.Page;

    public constructor (browser: ApolloBrowser, puppeteerPage: Puppeteer.Page) {
        this.#browser = browser;
        this.#puppeteerPage = puppeteerPage;
    }

    public get browser (): ApolloBrowser {
        return this.#browser;
    }

    public async setUserAgent (userAgent: string): Promise<void> {
        return this.#puppeteerPage.setUserAgent(userAgent);
    }

    public async goto (uri: string): Promise<void> {
        const response: any = await this.#puppeteerPage.goto(uri, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        if (!response) {
            throw new Error();
        }
    }

    public async evaluate (entity: string | (() => unknown)): Promise<any> {
        return this.#puppeteerPage.evaluate(entity);
    }

    public async focus (selector: string): Promise<boolean> {
        try {
            await this.#puppeteerPage.focus(selector);
        }
        catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    public async type (selector: string, text: string): Promise<boolean> {
        try {
            await this.#puppeteerPage.type(selector, text);
        }
        catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    public async click (selector: string, count: number = 1): Promise<boolean> {
        try {
            await this.#puppeteerPage.click(selector, {
                clickCount: count,
            });
        }
        catch (error) {
            console.log(error);

            return false;
        }

        return true;
    }

    public async waitForSelector (selector: string): Promise<void> {
        try {
            await this.#puppeteerPage.waitForSelector(selector);
        }
        catch (error) {
            console.log(error);
        }
    }

    public async close (): Promise<void> {
        if (this.#puppeteerPage) {
            await this.#puppeteerPage.close();
        }
    }
}

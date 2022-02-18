import * as Path from "path";
import * as Puppeteer from "puppeteer";
import { ApolloBrowserTab } from "#browsers/ApolloBrowserTab";

export class ApolloBrowser {
    static readonly #shared: ApolloBrowser = new ApolloBrowser();

    #puppeteerBrowser: Puppeteer.Browser | null;
    #pid: number;

    public constructor () {
        this.#puppeteerBrowser = null;
        this.#pid = -1;
    }

    public get pid (): number {
        return this.#pid;
    }

    public get isOpen (): boolean {
        return this.pid !== -1;
    }

    public async open (user?: string): Promise<void> {
        if (!this.#puppeteerBrowser) {
            const browserArguments: string[] = [
                "--no-sandbox",
                "--disable-gl-drawing-for-tests",
                "--mute-audio",
                "--window-size=1280,1024",
                "--disable-gpu",
                "--disable-infobars",
                "--disable-features=site-per-process",
            ];

            if (user) {
                browserArguments.push(`--user-data-dir=${Path.resolve(__dirname, user)}`);
            }

            this.#puppeteerBrowser = await Puppeteer.launch({
                headless: true,
                devtools: false,
                ignoreHTTPSErrors: true,
                args: browserArguments,
            });
            // @ts-ignore
            this.#pid = this.#puppeteerBrowser.process().pid;

            await this.closeTabs();
        }
    }

    public async openTab (): Promise<ApolloBrowserTab> {
        if (!this.#puppeteerBrowser) {
            throw new Error();
        }

        const page: Puppeteer.Page = await this.#puppeteerBrowser.newPage();

        await page.setRequestInterception(true);

        page.on("request", (request) => {
            switch (request.resourceType().toUpperCase()) {
                case "STYLESHEET":
                case "FONT":
                case "IMAGE":
                case "MEDIA": {
                    request.abort();

                    break;
                }
                default: {
                    request.continue();
                }
            }
        });

        return new ApolloBrowserTab(this, page);
    }

    public async closeTabs (): Promise<void> {
        if (!this.#puppeteerBrowser) {
            throw new Error();
        }

        await Promise.all((await this.#puppeteerBrowser.pages()).map((tab: Puppeteer.Page): unknown => tab.close()));
    }

    public async close (): Promise<void> {
        if (this.#puppeteerBrowser) {
            await this.#puppeteerBrowser.close();

            this.#pid = -1;
        }
    }

    public static async openTab (): Promise<ApolloBrowserTab> {
        if (!this.#shared.isOpen) {
            await this.#shared.open();
        }

        return this.#shared.openTab();
    }
}

import * as Path from "path";
import * as Puppeteer from "puppeteer";
import { ApolloBrowserTab } from "#browsers/ApolloBrowserTab";

export class ApolloBrowser {
    private static readonly _shared: ApolloBrowser = new ApolloBrowser();

    private _puppeteerBrowser: Puppeteer.Browser | null;
    private _pid: number;

    public constructor () {
        this._puppeteerBrowser = null;
        this._pid = -1;
    }

    public get pid (): number {
        return this._pid;
    }

    public get opened (): boolean {
        return this.pid !== -1;
    }

    public async open (user?: string): Promise<void> {
        if (!this._puppeteerBrowser) {
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

            this._puppeteerBrowser = await Puppeteer.launch({
                headless: true,
                devtools: false,
                ignoreHTTPSErrors: true,
                args: browserArguments,
            });
            // @ts-ignore
            this._pid = this._puppeteerBrowser.process().pid;

            await this.closeTabs();
        }
    }

    public async openTab (): Promise<ApolloBrowserTab> {
        if (!this._puppeteerBrowser) {
            throw new Error();
        }

        return new ApolloBrowserTab(this, await this._puppeteerBrowser.newPage());
    }

    public async closeTabs (): Promise<void> {
        if (!this._puppeteerBrowser) {
            throw new Error();
        }

        await Promise.all((await this._puppeteerBrowser.pages()).map((tab: Puppeteer.Page): Promise<any> => tab.close()));
    }

    public async close (): Promise<void> {
        if (this._puppeteerBrowser) {
            await this._puppeteerBrowser.close();
            this._pid = -1;
        }
    }

    public static async openTab (): Promise<ApolloBrowserTab> {
        if (!this._shared.opened) {
            await this._shared.open();
        }

        return this._shared.openTab();
    }
}

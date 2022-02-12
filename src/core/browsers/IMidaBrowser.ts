import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";

export interface IMidaBrowser {
    opened: boolean;

    open (user?: string): Promise<void>;

    openTab (): Promise<IMidaBrowserTab>;

    closeTabs (): Promise<void>;

    close (): Promise<void>;
}

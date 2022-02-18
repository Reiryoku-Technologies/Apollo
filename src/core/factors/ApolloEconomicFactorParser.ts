import { ApolloBrowserTab } from "#browsers/ApolloBrowserTab";
import { ApolloBrowser } from "#browsers/ApolloBrowser";
import { ApolloEconomicFactorDeclaration } from "#factors/ApolloEconomicFactorDeclaration";

export class ApolloEconomicFactorParser {
    static readonly #parsers: Map<string, (...parameters: any[]) => unknown> = new Map();

    private constructor () {
        // Silence is golden
    }

    public static addParser (name: string, procedure: (...parameters: any[]) => unknown): void {
        ApolloEconomicFactorParser.#parsers.set(name, procedure);
    }

    public static async useParser (name: string, uri: string): Promise<any> {
        // @ts-ignore
        return ApolloEconomicFactorParser.#parsers.get(name)(uri);
    }
}

const { addParser, } = ApolloEconomicFactorParser;

// <parsers>
// Parser for Investing.com
((): void => {
    // eslint-disable-next-line max-lines-per-function
    async function getDeclarations (uri: string): Promise<any> {
        const historyTabSelector: string = ".historyTab";
        const browserTab: ApolloBrowserTab = await ApolloBrowser.openTab();
        const declarations: ApolloEconomicFactorDeclaration[] = [];

        await browserTab.goto(uri);
        await browserTab.waitForSelector(historyTabSelector);

        const plainDeclarations: any[] = await browserTab.evaluate((): any[] => {
            const declarationsSelector: string = ".historyTab > table > tbody > tr";
            const plainDeclarations: any[] = [];

            for (const declarationNode of window.document.querySelectorAll(declarationsSelector)) {
                const plainDate: string = declarationNode.getAttribute("event_timestamp") as string;
                const declarationNodes: HTMLElement[] = [ ...declarationNode.querySelectorAll("td"), ];

                plainDeclarations.push({
                    plainDate,
                    plainActualValue: declarationNodes[2].innerText.trim(),
                    plainForecastValue: declarationNodes[3].innerText.trim(),
                });
            }

            return plainDeclarations;
        });

        for (const plainDeclaration of plainDeclarations) {
            const plainActualValue: string = plainDeclaration.plainActualValue;
            const plainForecastValue: string = plainDeclaration.plainForecastValue;

            declarations.push({
                date: normalizeDeclarationDate(plainDeclaration.plainDate),
                actualValue: plainActualValue ? normalizeDeclarationValue(plainDeclaration.plainActualValue) : undefined,
                forecastValue: plainForecastValue ? normalizeDeclarationValue(plainDeclaration.plainForecastValue) : undefined,
            });
        }

        declarations.sort((a: ApolloEconomicFactorDeclaration, b: ApolloEconomicFactorDeclaration): number => a.date.getTime() - b.date.getTime());

        for (let i: number = 0, length: number = declarations.length; i < length; ++i) {
            const declaration: ApolloEconomicFactorDeclaration = declarations[i];
            const previousDeclaration: ApolloEconomicFactorDeclaration | undefined = declarations[i - 1];
            const nextDeclaration: ApolloEconomicFactorDeclaration | undefined = declarations[i + 1];

            if (previousDeclaration) {
                declaration.previousDeclaration = previousDeclaration;
            }

            if (nextDeclaration) {
                declaration.nextDeclaration = nextDeclaration;
            }
        }

        try {
            browserTab.close();
        }
        catch {
            // Silence is golden
        }

        return declarations;
    }

    // Used to convert a declaration value to a native Number type
    function normalizeDeclarationValue (value: string): number {
        let normalizedValue: number = Number(value.replace(",", "."));

        if (Number.isFinite(normalizedValue)) {
            return normalizedValue;
        }

        let multiplier: number = 1;

        switch (value[value.length - 1].toUpperCase()) {
            case "K": {
                multiplier = 1000;

                break;
            }
            case "M": {
                multiplier = 1000000;

                break;
            }
            case "B": {
                multiplier = 1000000000;

                break;
            }
        }

        normalizedValue = Number(value.substring(0, value.length - 1).replace(",", ".")) * multiplier;

        if (!Number.isFinite(normalizedValue)) {
            throw new Error("Unknown format");
        }

        return normalizedValue;
    }

    // Used to convert a declaration date to a native Date type
    function normalizeDeclarationDate (plainDate: string): Date {
        const parts: string[] = plainDate.trim().split(" ");
        const leftParts: string[] = parts[0].split("-");
        const rightParts: string[] = parts[1].split(":");

        return new Date(Date.UTC(
            Number(leftParts[0]), Number(leftParts[1]) - 1, Number(leftParts[2]),
            Number(rightParts[0]), Number(rightParts[1]), Number(rightParts[2])
        ));
    }

    addParser("Investing.com", getDeclarations);
})();
// </parsers>

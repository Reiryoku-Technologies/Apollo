import { ApolloBrowserTab } from "#browsers/ApolloBrowserTab";
import { ApolloBrowser } from "#browsers/ApolloBrowser";

export class ApolloEconomicFactorParser {
    static readonly #parsers: Map<string, (...parameters: any[]) => unknown> = new Map();

    private constructor () {
        // Silence is golden
    }

    public static addParser (name: string, procedure: (...parameters: any[]) => unknown): void {
        ApolloEconomicFactorParser.#parsers.set(name, procedure);
    }
}

const { addParser, } = ApolloEconomicFactorParser;

// <parsers>
// Parser for investing.com
((): void => {
    // eslint-disable-next-line max-lines-per-function, id-length
    async function getStatements (uri: string): Promise<any> {
        const browserTab: ApolloBrowserTab = await ApolloBrowser.openTab();
        const historyTabSelector: string = ".historyTab";

        await browserTab.goto(uri);
        await browserTab.waitForSelector(historyTabSelector);

        const statementData: any = await browserTab.evaluate((): any => {
            const latestStatementSelector: any = ".historyTab > table > tbody > tr:first-child > td";
            const latestStatementNodes: any[] = [ ...window.document.querySelectorAll(latestStatementSelector), ];

            const statement = {
                date: `${latestStatementNodes[0].innerText} ${latestStatementNodes[1].innerText}`.trim(),
                nextStatementDate: null,
                actual: latestStatementNodes[2].innerText.trim(),
                forecast: latestStatementNodes[3].innerText.trim(),
                previous: latestStatementNodes[4].innerText.trim(),
            };

            let statementIndex = 2;

            while (!statement.actual) {
                // @ts-ignore
                statement.nextStatementDate = statement.date;

                const previousStatementSelector = `.historyTab > table > tbody > tr:nth-child(${statementIndex}) > td`;
                const previousStatementNodes: any[] = [ ...window.document.querySelectorAll(previousStatementSelector), ];

                statement.date = `${previousStatementNodes[0].innerText} ${previousStatementNodes[1].innerText}`.trim();
                statement.actual = previousStatementNodes[2].innerText.trim();
                statement.forecast = previousStatementNodes[3].innerText.trim();

                ++statementIndex;
            }

            return statement;
        });
        const sanitizedStatementData: any = {};

        sanitizedStatementData.date = new Date(statementData.date);

        // New York time.
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        sanitizedStatementData.date.setTime(sanitizedStatementData.date.getTime() + 6 * 60 * 60 * 1000);

        if (sanitizedStatementData.nextStatementDate) {
            sanitizedStatementData.nextStatementDate = new Date(statementData.nextStatementDate);

            // New York time.
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            sanitizedStatementData.nextStatementDate.setTime(sanitizedStatementData.nextStatementDate.getTime() + 6 * 60 * 60 * 1000);
        }
        else {
            delete sanitizedStatementData.nextStatementDate;
        }

        sanitizedStatementData.actual = normalizeStatementValue(statementData.actual);
        sanitizedStatementData.forecast = normalizeStatementValue(statementData.forecast);

        try {
            browserTab.close();
        }
        catch {
            // Silence is golden
        }

        return sanitizedStatementData;
    }

    function normalizeStatementValue (value: string): number {
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
})();
// </parsers>

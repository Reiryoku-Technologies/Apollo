import { ApolloBrowserTab } from "#browsers/ApolloBrowserTab";
import { ApolloBrowser } from "#browsers/ApolloBrowser";
import { ApolloEconomicFactorStatement } from "#factors/ApolloEconomicFactorStatement";

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
    // eslint-disable-next-line max-lines-per-function, id-length
    async function getStatements (uri: string): Promise<any> {
        const historyTabSelector: string = ".historyTab";
        const browserTab: ApolloBrowserTab = await ApolloBrowser.openTab();
        const statements: ApolloEconomicFactorStatement[] = [];

        await browserTab.goto(uri);
        await browserTab.waitForSelector(historyTabSelector);

        const plainStatements: any[] = await browserTab.evaluate((): any[] => {
            const statementsSelector: string = ".historyTab > table > tbody > tr";
            const plainStatements: any[] = [];

            for (const statementNode of window.document.querySelectorAll(statementsSelector)) {
                const plainDate: string = statementNode.getAttribute("event_timestamp") as string;
                const statementNodes: HTMLElement[] = [ ...statementNode.querySelectorAll("td"), ];

                plainStatements.push({
                    plainDate,
                    plainActualValue: statementNodes[2].innerText.trim(),
                    plainForecastValue: statementNodes[3].innerText.trim(),
                });
            }

            return plainStatements;
        });

        console.log(plainStatements);

        for (const plainStatement of plainStatements) {
            const plainActualValue: string = plainStatement.plainActualValue;
            const plainForecastValue: string = plainStatement.plainForecastValue;

            statements.push({
                date: normalizeStatementDate(plainStatement.plainDate),
                actualValue: plainActualValue ? normalizeStatementValue(plainStatement.plainActualValue) : undefined,
                forecastValue: plainForecastValue ? normalizeStatementValue(plainStatement.plainForecastValue) : undefined,
            });
        }

        statements.sort((a: ApolloEconomicFactorStatement, b: ApolloEconomicFactorStatement): number => a.date.getTime() - b.date.getTime());

        for (let i: number = 0, length: number = statements.length; i < length; ++i) {
            const statement: ApolloEconomicFactorStatement = statements[i];
            const previousStatement: ApolloEconomicFactorStatement | undefined = statements[i - 1];
            const nextStatement: ApolloEconomicFactorStatement | undefined = statements[i + 1];

            if (previousStatement) {
                statement.previousStatement = previousStatement;
            }

            if (nextStatement) {
                statement.nextStatement = nextStatement;
            }
        }

        try {
            browserTab.close();
        }
        catch {
            // Silence is golden
        }

        return statements;
    }

    // Used to convert a statement value to a native Number type
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

    // Used to convert the statement date to a native Date type
    function normalizeStatementDate (plainDate: string): Date {
        const parts: string[] = plainDate.trim().split(" ");
        const leftParts: string[] = parts[0].split("-");
        const rightParts: string[] = parts[1].split(":");

        return new Date(Date.UTC(
            Number(leftParts[0]), Number(leftParts[1]) - 1, Number(leftParts[2]),
            Number(rightParts[0]), Number(rightParts[1]), Number(rightParts[2])
        ));
    }

    addParser("Investing.com", getStatements);
})();
// </parsers>

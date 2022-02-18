import { fetchLatestEconomicStatementData } from "#utilities/ApolloUtilities";

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

export { addParser };

// <parsers>
addParser("investing.com", ({ uri, }): any => fetchLatestEconomicStatementData(uri));
// </parsers>

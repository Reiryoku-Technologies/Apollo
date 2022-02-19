import axios from "axios";
import * as cheerio from "cheerio";
import { ApolloEconomicFactorDeclaration } from "#factors/ApolloEconomicFactorDeclaration";
import { GenericObject } from "#utilities/GenericObject";

export class ApolloEconomicFactorProvider {
    private constructor () {
        // Silence is golden
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedProviders: Map<string, (parameters: GenericObject) => Promise<ApolloEconomicFactorDeclaration[]>> = new Map();

    public static addProvider (name: string, procedure: (parameters: GenericObject) => Promise<ApolloEconomicFactorDeclaration[]>): void {
        ApolloEconomicFactorProvider.#installedProviders.set(name, procedure);
    }

    public static async useProvider (name: string, parameters: GenericObject = {}): Promise<ApolloEconomicFactorDeclaration[]> {
        // eslint-disable-next-line max-len
        const procedure: ((parameters: GenericObject) => Promise<ApolloEconomicFactorDeclaration[]>) | undefined = ApolloEconomicFactorProvider.#installedProviders.get(name);

        if (!procedure) {
            throw new Error("Unknown provider");
        }

        return procedure(parameters);
    }
}

const { addProvider, } = ApolloEconomicFactorProvider;

// <providers>
// Provider: Investing.com
((): void => {
    // eslint-disable-next-line max-lines-per-function
    async function getDeclarations ({ uri, }: GenericObject): Promise<ApolloEconomicFactorDeclaration[]> {
        const declarations: ApolloEconomicFactorDeclaration[] = [];
        const $ = cheerio.load((await axios.get(uri)).data);

        const plainDeclarations: any[] = ((): any[] => {
            const declarationsSelector: string = ".historyTab > table > tbody > tr";
            const plainDeclarations: any[] = [];

            $(declarationsSelector).each((index, declarationNode) => {
                const plainDate: string = $(declarationNode).attr("event_timestamp") as string;
                const declarationNodes: any = $(declarationNode).children("td");

                plainDeclarations.push({
                    plainDate: plainDate.trim(),
                    plainActualValue: $(declarationNodes[2]).text().trim(),
                    plainForecastValue: $(declarationNodes[3]).text().trim(),
                });
            });

            return plainDeclarations;
        })();

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

    addProvider("Investing.com", getDeclarations);
})();
// </providers>

import { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";

export class ApolloEconomicFactor {
    readonly #name: string;
    readonly #affectedAssets: string[];

    protected constructor ({ name, affectedAssets, }: ApolloEconomicFactorParameters) {
        this.#name = name;
        this.#affectedAssets = affectedAssets ?? [];
    }

    public get name (): string {
        return this.#name;
    }

    public get affectedAssets (): string[] {
        return [ ...this.#affectedAssets, ];
    }

    static #installedFactors: Map<string, ApolloEconomicFactor> = new Map();

    public static add (name: string, factor: ApolloEconomicFactor): void {

    }

    public static getByGroupName (name: string): ApolloEconomicFactor[] {
        const factors: ApolloEconomicFactor[] = [];

        for (const factor of this.#installedFactors.values()) {
            if (factor.name.startsWith(`${name}::`)) {
                factors.push(factor);
            }
        }

        return factors;
    }
}

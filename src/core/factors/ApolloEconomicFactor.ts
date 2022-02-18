import { ApolloEconomicFactorStatement } from "#factors/ApolloEconomicFactorStatement";
import { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";
import { IApolloEconomicFactor } from "#factors/IApolloEconomicFactor";

export abstract class ApolloEconomicFactor {
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

    public async getLastStatement (): Promise<ApolloEconomicFactorStatement> {
        const declarations: ApolloEconomicFactorStatement[] = await this.getStatements();
        const length: number = declarations.length;

        return declarations[length - 1] as ApolloEconomicFactorStatement;
    }

    public abstract getStatements (): Promise<ApolloEconomicFactorStatement[]>;

    public abstract getPendingStatement (): Promise<ApolloEconomicFactorStatement[]>;

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

export function addFactor (factor: IApolloEconomicFactor): void {

}

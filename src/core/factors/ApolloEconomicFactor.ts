import { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";
import { GenericObject } from "#utilities/GenericObject";

export class ApolloEconomicFactor {
    readonly #id: string;
    readonly #name: string;
    readonly #affectedAssets: string[];
    readonly #providers: GenericObject[];

    protected constructor ({
        id,
        name,
        affectedAssets,
        providers,
    }: ApolloEconomicFactorParameters) {
        this.#id = id;
        this.#name = name;
        this.#affectedAssets = affectedAssets ?? [];
        this.#providers = providers;
    }

    public get id (): string {
        return this.#id;
    }

    public get name (): string {
        return this.#name;
    }

    public get affectedAssets (): string[] {
        return [ ...this.#affectedAssets, ];
    }

    static #installedFactors: Map<string, ApolloEconomicFactor> = new Map();

    public static add (id: string, factor: ApolloEconomicFactor): void {
        this.#installedFactors.set(id, factor);
    }

    public static getById (id: string): ApolloEconomicFactor | undefined {
        return this.#installedFactors.get(id);
    }
}

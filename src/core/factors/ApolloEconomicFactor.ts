import { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";
import { GenericObject } from "#utilities/GenericObject";
import { ApolloEconomicFactorDeclaration } from "#factors/ApolloEconomicFactorDeclaration";
import { ApolloEconomicFactorProvider } from "#factors/ApolloEconomicFactorProvider";

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

    public async getDeclarations (): Promise<ApolloEconomicFactorDeclaration[]> {
        const provider: GenericObject | undefined = this.#providers[0];

        if (!provider) {
            throw new Error("This economic factor has no data provider");
        }

        return ApolloEconomicFactorProvider.useProvider(provider.name, provider.parameters);
    }

    public async getLastDeclaration (): Promise<ApolloEconomicFactorDeclaration | undefined> {
        const declarations: ApolloEconomicFactorDeclaration[] = await this.getDeclarations();

        return declarations[declarations.length - 1];
    }

    public async getPendingDeclaration (): Promise<ApolloEconomicFactorDeclaration | undefined> {
        const declarations: ApolloEconomicFactorDeclaration[] = await this.getDeclarations();
        const lastDeclaration: ApolloEconomicFactorDeclaration | undefined = declarations[declarations.length - 1];

        if (!lastDeclaration || Number.isFinite(lastDeclaration.actualValue)) {
            return undefined;
        }

        return lastDeclaration;
    }

    /* *** *** *** Reiryoku Technologies *** *** *** */

    static readonly #installedFactors: Map<string, ApolloEconomicFactor> = new Map();

    public static add (id: string, factor: ApolloEconomicFactor): void {
        this.#installedFactors.set(id, factor);
    }

    public static getById (id: string): ApolloEconomicFactor | undefined {
        return this.#installedFactors.get(id);
    }
}

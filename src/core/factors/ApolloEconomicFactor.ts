import { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";
import { GenericObject } from "#utilities/GenericObject";
import { ApolloEconomicFactorDeclaration } from "#factors/ApolloEconomicFactorDeclaration";
import { ApolloEconomicFactorProvider } from "#factors/ApolloEconomicFactorProvider";

export class ApolloEconomicFactor {
    readonly #id: string;
    readonly #name: string;
    readonly #affectedAssets: string[];
    readonly #providers: GenericObject[];
    #isCacheEnabled: boolean;
    #cacheTimestamp?: number;
    #cachedDeclarations: ApolloEconomicFactorDeclaration[];

    public constructor ({
        id,
        name,
        affectedAssets,
        providers,
    }: ApolloEconomicFactorParameters) {
        this.#id = id;
        this.#name = name;
        this.#affectedAssets = affectedAssets ?? [];
        this.#providers = providers;
        this.#isCacheEnabled = true;
        this.#cacheTimestamp = undefined;
        this.#cachedDeclarations = [];
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

    public get isCacheEnabled (): boolean {
        return this.#isCacheEnabled;
    }

    public set isCacheEnabled (isCacheEnabled: boolean) {
        if (!isCacheEnabled) {
            this.#cacheTimestamp = undefined;
            this.#cachedDeclarations = [];
        }

        this.#isCacheEnabled = isCacheEnabled;
    }

    public async getDeclarations (): Promise<ApolloEconomicFactorDeclaration[]> {
        if (this.#isCacheEnabled && this.#cacheTimestamp) {
            if (Date.now() < this.#cacheTimestamp) {
                return this.#cachedDeclarations;
            }

            this.#cacheTimestamp = undefined;
            this.#cachedDeclarations = [];
        }

        const provider: GenericObject | undefined = this.#providers[0];

        if (!provider) {
            throw new Error("This economic factor has no data provider");
        }

        const declarations: ApolloEconomicFactorDeclaration[] = await ApolloEconomicFactorProvider.useProvider(provider.name, provider.parameters);

        if (this.#isCacheEnabled) {
            this.#cachedDeclarations = declarations;

            for (const declaration of declarations) {
                const declarationTimestamp: number = declaration.date.getTime();

                if (declarationTimestamp > Date.now()) {
                    // Cache declarations until the next scheduled declaration
                    this.#cacheTimestamp = declarationTimestamp;
                }
            }
        }

        return declarations;
    }

    public async getLastDeclaration (): Promise<ApolloEconomicFactorDeclaration | undefined> {
        const declarations: ApolloEconomicFactorDeclaration[] = await this.getDeclarations();
        let index: number = declarations.length;
        let lastDeclaration: ApolloEconomicFactorDeclaration;

        do {
            --index;
            lastDeclaration = declarations[index];

            if (!lastDeclaration) {
                return undefined;
            }
        }
        while (ApolloEconomicFactor.isPendingDeclaration(lastDeclaration));

        return lastDeclaration;
    }

    public async getLastPendingDeclaration (): Promise<ApolloEconomicFactorDeclaration | undefined> {
        const declarations: ApolloEconomicFactorDeclaration[] = await this.getDeclarations();
        const lastDeclaration: ApolloEconomicFactorDeclaration | undefined = declarations[declarations.length - 1];

        if (!lastDeclaration || !ApolloEconomicFactor.isPendingDeclaration(lastDeclaration)) {
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

    public static isPendingDeclaration (declaration: ApolloEconomicFactorDeclaration): boolean {
        return !Number.isFinite(declaration.actualValue);
    }
}

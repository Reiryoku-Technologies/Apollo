import { EconomicFactorStatement } from "#factors/EconomicFactorStatement";
import { EconomicFactorParameters } from "#factors/EconomicFactorParameters";

export abstract class EconomicFactor {
    readonly #importance: number;
    readonly #affectedAssets: string[];

    protected constructor ({}: EconomicFactorParameters) {
        this.#importance = 0;
        this.#affectedAssets = [];
    }

    public get importance (): number {
        return this.#importance;
    }

    public get affectedAssets (): string[] {
        return [ ...this.#affectedAssets, ];
    }

    public async getLastDeclaration (): Promise<EconomicFactorStatement> {
        const declarations: EconomicFactorStatement[] = await this.getDeclarations();
        const length: number = declarations.length;

        return declarations[length - 1] as EconomicFactorStatement;
    }

    public abstract getDeclarations (): Promise<EconomicFactorStatement[]>;

    public abstract getPendingDeclarations (): Promise<EconomicFactorStatement[]>;

    static #installedFactors: Map<string, EconomicFactor> = new Map();

    public static add (name: string, factor: EconomicFactor): void {

    }
}

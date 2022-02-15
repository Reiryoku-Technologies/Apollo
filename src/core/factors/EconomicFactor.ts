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

    public async getLastStatement (): Promise<EconomicFactorStatement> {
        const declarations: EconomicFactorStatement[] = await this.getStatements();
        const length: number = declarations.length;

        return declarations[length - 1] as EconomicFactorStatement;
    }

    public abstract getStatements (): Promise<EconomicFactorStatement[]>;

    public abstract getPendingStatement (): Promise<EconomicFactorStatement[]>;

    static #installedFactors: Map<string, EconomicFactor> = new Map();

    public static add (name: string, factor: EconomicFactor): void {

    }
}

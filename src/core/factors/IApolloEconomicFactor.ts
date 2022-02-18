import { ApolloEconomicFactorStatement } from "#factors/ApolloEconomicFactorStatement";

export interface IApolloEconomicFactor {
    name: string;
    affectedAssets?: string[];
    getStatements (): Promise<ApolloEconomicFactorStatement>;
}

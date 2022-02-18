import { ApolloEconomicFactor } from "#factors/ApolloEconomicFactor";

export type ApolloEconomicFactorStatement = {
    date: Date;
    // factor: ApolloEconomicFactor;
    previousStatement?: ApolloEconomicFactorStatement;
    nextStatement?: ApolloEconomicFactorStatement;
    actualValue?: number;
    forecastValue?: number;
};

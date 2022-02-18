export type ApolloEconomicFactorStatement = {
    timestamp: number;
    previousStatement?: ApolloEconomicFactorStatement;
    nextStatement?: ApolloEconomicFactorStatement;
    actualValue?: number;
    forecastValue?: number;
};

export type ApolloEconomicFactorDeclaration = {
    date: Date;
    previousDeclaration?: ApolloEconomicFactorDeclaration;
    nextDeclaration?: ApolloEconomicFactorDeclaration;
    actualValue?: number;
    forecastValue?: number;
};

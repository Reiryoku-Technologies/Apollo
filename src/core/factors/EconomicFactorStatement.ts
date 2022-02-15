export type EconomicFactorStatement = {
    timestamp: number;
    previousStatement?: EconomicFactorStatement;
    nextStatement?: EconomicFactorStatement;
    actualValue?: number;
    forecastValue?: number;
};

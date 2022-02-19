import { ApolloEconomicFactorProvider } from "#factors/ApolloEconomicFactorParser";

export * from "!/src/core/Apollo";

(async (): Promise<void> => {
    console.time("#start");
    console.log(await ApolloEconomicFactorProvider.useParser("Investing.com", "https://www.investing.com/economic-calendar/trade-balance-1064"));
    console.timeEnd("#start");
    process.exit();
})();

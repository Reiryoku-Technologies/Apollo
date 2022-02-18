import { fetchLatestEconomicStatementData } from "#utilities/ApolloUtilities";

export * from "!/src/core/Apollo";

(async (): Promise<void> => {
    console.time("#start");
    console.log(await fetchLatestEconomicStatementData("https://www.investing.com/economic-calendar/existing-home-sales-99"));
    console.timeEnd("#start");
})();

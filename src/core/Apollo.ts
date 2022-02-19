import { ApolloEconomicFactor } from "#factors/ApolloEconomicFactor";
import * as fs from "fs";
import { GenericObject } from "#utilities/GenericObject";

class Apollo {
    private constructor () {
        // Silence is golden
    }
}

JSON.parse(fs.readFileSync("../../factors.json", { encoding: "UTF-8", })).forEach((plainFactor: GenericObject) => {
    ApolloEconomicFactor.add(plainFactor.id, new ApolloEconomicFactor({
        id: plainFactor.id,
        name: "",
        affectedAssets: [],
        providers: plainFactor.providers,
    }));
});

// <public-api>
export { Apollo };

export { ApolloEconomicFactor } from "#factors/ApolloEconomicFactor";
export { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";
export { ApolloEconomicFactorDeclaration } from "#factors/ApolloEconomicFactorDeclaration";
// </public-api>

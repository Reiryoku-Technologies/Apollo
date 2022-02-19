import { ApolloEconomicFactor } from "#factors/ApolloEconomicFactor";
import { GenericObject } from "#utilities/GenericObject";

class Apollo {
    private constructor () {
        // Silence is golden
    }
}

function readFactors (factors: GenericObject[]): void {

}

// <public-api>
export { Apollo };

export { ApolloEconomicFactor } from "#factors/ApolloEconomicFactor";
export { ApolloEconomicFactorParameters } from "#factors/ApolloEconomicFactorParameters";
export { ApolloEconomicFactorDeclaration } from "#factors/ApolloEconomicFactorDeclaration";
// </public-api>

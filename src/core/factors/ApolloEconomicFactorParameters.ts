import { GenericObject } from "#utilities/GenericObject";

export type ApolloEconomicFactorParameters = {
    id: string;
    name: string;
    affectedAssets?: string[];
    providers: GenericObject[];
};

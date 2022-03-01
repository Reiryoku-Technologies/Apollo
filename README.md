# Apollo
[![Image](https://img.shields.io/npm/v/@reiryoku/apollo)](https://www.npmjs.com/package/@reiryoku/apollo)
[![Image](https://img.shields.io/npm/l/@reiryoku/apollo)](LICENSE)
[![Image](https://img.shields.io/discord/780532638846287904?label=community)](https://discord.gg/cKyWTUsr3q)
<br>

Apollo is a JavaScript library to get real-time economic declarations such as inflation rates,
unemployment rates or interest rates reported by governments or other entities.


This library gives its best when used with [Mida](https://github.com/Reiryoku-Technologies/Mida), the JavaScript
framework to operate in global financial markets which can be used with Apollo to create expert advisors and
perform market analysis based on macroeconomic data.

## Usage
### How to get an economic factor and its declarations
First you have to choose an economic factor and then request its declarations
```javascript
const { ApolloEconomicFactor } = require("@reiryoku/apollo");

const japanInflationRate = ApolloEconomicFactor.getById("Japan/CPI/YoY");
const lastDeclaration = await japanInflationRate.getLastDeclaration();

console.log(`Japan inflation rate is ${lastDeclaration.actualValue}%`);
console.log(`The last declaration was made on ${lastDeclaration.date}`);
```

### Economic declaration type
```typescript
export type ApolloEconomicFactorDeclaration = {
    date: Date;
    previousDeclaration?: ApolloEconomicFactorDeclaration;
    nextDeclaration?: ApolloEconomicFactorDeclaration;
    actualValue?: number;
    forecastValue?: number;
};
```

## Supported economic factors
| Name                                  | Id                            | Value type                | Source/s              |
| -----------                           | -----------                   | -----------               | -----------           |
| U.S. Non Farm Payrolls (MoM)          | US/NonFarmPayrolls/MoM        | Pure number               | Investing.com         |
| U.S. Interest Rate                    | US/InterestRate               | Percentage                | Investing.com         |
| U.S. Unemployment Rate                | US/UnemploymentRate/MoM       | Percentage                | Investing.com         |
| U.S. CPI (YoY)                        | US/CPI/YoY                    | Percentage                | Investing.com         |
| U.S. Core CPI (MoM)                   | US/CoreCPI/MoM                | Percentage                | Investing.com         |
| U.S. Core CPI (YoY)                   | US/CoreCPI/YoY                | Percentage                | Investing.com         |
| U.S. Crude Oil Inventories (WoW)      | US/CrudeOilInventories/WoW    | Pure number               | Investing.com         |
| Eurozone CPI (YoY)                    | Eurozone/CPI/YoY              | Percentage                | Investing.com         |
| Eurozone Interest Rate                | Eurozone/InterestRate         | Percentage                | Investing.com         |
| Italy CPI (YoY)                       | Italy/CPI/YoY                 | Percentage                | Investing.com         |
| Germany CPI (YoY)                     | Germany/CPI/YoY               | Percentage                | Investing.com         |
| Japan CPI (YoY)                       | Japan/CPI/YoY                 | Percentage                | Investing.com         |
| Canada Interest Rate                  | Canada/InterestRate           | Percentage                | Investing.com         |

**Economic factors ids are case sensitive**.

### Declarations frequency
- WoW means week over week
- MoM means month over month
- YoY means year over year

## How to contribute
### How to add a new economic provider
To add a new economic factor you need to edit the `factors.json` file and include a new definition.
- Visit https://www.investing.com/economic-calendar/
- Choose the economic factor to add, then open its link
- Add a new definition to `factors.json` according to the existent format, include the URL of the economic factor
- Done! Create a pull request

## Providers
Apollo is desgined to support multiple data providers, for now all the data is kindly offered by [Investing.com](https://www.investing.com).

<br><br>
<p align="center">
    <img src="images/providers/investing.com.svg" alt="Investing.com" width="200px">
</p>
<br><br>

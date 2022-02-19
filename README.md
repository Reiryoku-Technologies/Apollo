# Apollo

## Usage
### How to get an economic factor
```javascript
const { ApolloEconomicFactor } = require("@reiryoku/apollo");

const japanInflationRate = ApolloEconomicFactor.getById("Japan/CPI/YoY");
const lastDeclaration = await japanInflationRate.getLastDeclaration();

console.log(`Japan inflation rate is ${lastDeclaration.actualValue}%`);
console.log(`The last declaration was made on ${lastDeclaration.date}`);
```

### Economic factor type
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
| U.S. Crude Oil Inventories (WoW)      | US/CrudeOilInventories/WoW    | Pure number               | Investing.com         |
| Eurozone CPI (YoY)                    | Eurozone/CPI/YoY              | Percentage                | Investing.com         |
| Italy CPI (YoY)                       | Italy/CPI/YoY                 | Percentage                | Investing.com         |
| Japan CPI (YoY)                       | Japan/CPI/YoY                 | Percentage                | Investing.com         |
| Canada Interest Rate CPI (MoM)        | Canada/InterestRate/MoM       | Percentage                | Investing.com         |

### Declarations frequency
- WoW means week over week
- MoM means month over month
- YoY means year over year

# Apollo

## How to get an economic factor
```javascript
const { ApolloEconomicFactor } = require("@reiryoku/apollo");

const usNonFarmPayrolls = ApolloEconomicFactor.get("US::NonFarmPayrolls");
const lastStatement = await usNonFarmPayrolls.getLastStatement();

console.log("This data has been released on " + new Date(lastStatement.timestamp));
console.log("Actual value => " + lastStatement.actualValue);
console.log("Forecast value => " + lastStatement.forecastValue);

// Triggered when a new statement is made
usNonFarmPayrolls.on("statement", (statement) => {
    console.log(statement.actualValue);
});
```

## Supported economic factors
| Name                                  | Id                            | Value type                | Source/s              |
| -----------                           | -----------                   | -----------               | -----------           |
| U.S. Non Farm Payrolls (MoM)          | US/NonFarmPayrolls/MoM        | Pure number               | Investing.com         |
| U.S. Crude Oil Inventories (WoW)      | US/CrudeOilInventories/WoW    | Pure number               | Investing.com         |
| Eurozone CPI (YoY)                    | Eurozone/CPI/YoY              | Percentage                | Investing.com         |
| Italy CPI (YoY)                       | Italy/CPI/YoY                 | Percentage                | Investing.com         |
| Canada Interest Rate CPI (MoM)        | Canada/InterestRate/MoM       | Percentage                | Investing.com         |

### Statements frequency
**`WoW = Week over Week`**, **`MoM = Month over Month`**, **`YoY = Year over Year`**

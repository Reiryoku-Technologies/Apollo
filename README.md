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
| Name                          | Id                        | Format                    | Source/s              |
| -----------                   | -----------               | -----------               | -----------           |
| U.S. Non Farm Payrolls        | US::NonFarmPayrolls       | Pure number               | Investing.com         |
| U.S. Crude Oil Inventories    | US::CrudeOilInventories   | Pure number               | Investing.com         |

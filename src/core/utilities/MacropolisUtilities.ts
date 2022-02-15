// Used to fetch the latest statement data of an economic factor from a webpage.
// At this time only www.investing.com is supported.
import { IMidaBrowserTab } from "#browsers/IMidaBrowserTab";
import { ApolloBrowser } from "#browsers/ChromiumBrowser";

async function fetchLatestEconomicStatementData (uri: string): Promise<any> {
    const browserTab: IMidaBrowserTab = await ApolloBrowser.openTab();
const historyTabSelector: string = ".historyTab";

await browserTab.goto(uri);
await browserTab.waitForSelector(historyTabSelector);

const statementData: any = await browserTab.evaluate(`(() => {
            const latestStatementSelector = ".historyTab > table > tbody > tr:first-child > td";
            const latestStatementNodes = window.document.querySelectorAll(latestStatementSelector);
            
            const statement = {
                date: (latestStatementNodes[0].innerText + " " + latestStatementNodes[1].innerText).trim(),
                nextStatementDate: null,
                actual: latestStatementNodes[2].innerText.trim(),
                forecast: latestStatementNodes[3].innerText.trim(),
                previous: latestStatementNodes[4].innerText.trim(),
            };
            
            let statementIndex = 2;
            
            while (!statement.actual) {
                statement.nextStatementDate = statement.date;
                
                const previousStatementSelector = ".historyTab > table > tbody > tr:nth-child(" + statementIndex + ") > td";
                const previousStatementNodes = window.document.querySelectorAll(previousStatementSelector);
                
                statement.date = (previousStatementNodes[0].innerText + " " + previousStatementNodes[1].innerText).trim();
                statement.actual = previousStatementNodes[2].innerText.trim();
                statement.forecast = previousStatementNodes[3].innerText.trim();
                statement.previous = previousStatementNodes[4].innerText.trim();
                
                ++statementIndex;
            }
            
            return statement;
        })();`);
const sanitizedStatementData: any = {
    ...statementData,
};

sanitizedStatementData.date = new Date(statementData.date);

// New York time.
sanitizedStatementData.date.setTime(sanitizedStatementData.date.getTime() + (6 * 60 * 60 * 1000));

if (sanitizedStatementData.nextStatementDate) {
    sanitizedStatementData.nextStatementDate = new Date(statementData.nextStatementDate);

    // New York time.
    sanitizedStatementData.nextStatementDate.setTime(sanitizedStatementData.nextStatementDate.getTime() + (6 * 60 * 60 * 1000));
}
else {
    delete sanitizedStatementData.nextStatementDate;
}

const actual: number = parseFloat(statementData.actual.replace(",", ""));
let previous: number;

if (sanitizedStatementData.forecast) {
    previous = parseFloat(statementData.forecast.replace(",", ""));
}
else {
    previous = parseFloat(statementData.previous.replace(",", ""));

    delete sanitizedStatementData.forecast;
}

if (statementData.actual.indexOf("%") !== -1) {
    sanitizedStatementData.actualDistance = actual - previous;
}
else {
    sanitizedStatementData.actualDistance = (actual - previous) * 100 / Math.abs(previous);
}

await browserTab.close();

return sanitizedStatementData;
}


var insert = require('./insertCurrency.js');


exports.addCurrencyValues = (message, currencyValues) => {
    message.midValues = [];
    message.midValues = insert.insert(message.midValues, (message.bestBid + message.bestAsk) / 2);
    currencyValues.push(message);
    return currencyValues
}

/**
 * Desc:: Create a new row for the new currency pair
 * @param message 
 * @param currencyTable 
 */
exports.createCurrencyTable = (message, currencyTable) => {
    let newRow = currencyTable.insertRow(currencyTable.rows.length);
    let newCell;
    let c = 0;
    Object.keys(message).forEach(element => {
        if (element != 'midValues') {
            let newCell = newRow.insertCell(c);
            let newText = document.createTextNode(message[element]);
            newCell.appendChild(newText);
            c++;
        }
    });
    newCell = newRow.insertCell(c);
    let midValueSparkline = new Sparkline(newCell);
    midValueSparkline.draw(message.midValues);
}

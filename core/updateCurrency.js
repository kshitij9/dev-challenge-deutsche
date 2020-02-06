var insert = require('./insertCurrency.js');


exports.updateCurrencyValues = (index,message,currencyValues) => {
    currencyValues[index].midValues = insert.insert(currencyValues[index].midValues, (message.bestBid + message.bestAsk) / 2)

    //Update values for the currency pair
    Object.keys(currencyValues[index]).forEach(element => {
        if (element != 'name' && element != 'midValues') {
            currencyValues[index][element] = message[element];
        }
    });

    return currencyValues;
}

/**
 * Desc:: Update the currency table with the new values and sparkline
 * @param currencyTable 
 */
exports.updateCurrencyTable = (currencyTable,message,  currencyValues) => {
    let index = 0;

    currencyValues.forEach(item => {
        let c = 0;
        Object.keys(item).forEach(key => {
            if (key != 'midValues') {
                currencyTable.rows[index].cells[c].innerHTML = item[key];
                c++;
            } else {
                let midValueSparkline = new Sparkline(currencyTable.rows[index].cells[c]);
                midValueSparkline.draw(item.midValues);
                c++;
            }
        });

        index++;
    })
}
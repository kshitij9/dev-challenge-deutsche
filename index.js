/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html')
    // Apply the styles in style.css to the page.
require('./site/style.css')

// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = true
var currencyValues = [];
var midValues = [];
const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
    if (global.DEBUG) {}
}


function connectCallback() {
    client.subscribe('/fx/prices', pricesUpdated);
}


/**
 * Desc: Function called after each update in price via stomp to update UI
 * @params message
 */
pricesUpdated = function(message) {
    message = JSON.parse(message.body);
    let currencyTable = document.getElementById('currencyTable').getElementsByTagName('tbody')[0];

    //Get the index of the row for which the values need to be updated
    let currencyMatchIndex = currencyValues.findIndex(e => e.name === message.name);

    //If the currency pair already exist
    if (currencyMatchIndex !== -1) {

        //If midvalues are over 30 remove the last midvalue
        if (currencyValues[currencyMatchIndex].midValues.length === 30) {
            currencyValues[currencyMatchIndex].midValues.splice(0, 1);
        }
        currencyValues[currencyMatchIndex].midValues.push((message.bestBid + message.bestAsk) / 2);

        //Update values for the currency pair
        Object.keys(currencyValues[currencyMatchIndex]).forEach(element => {
            if (element != 'name' && element != 'midValues') {
                currencyValues[currencyMatchIndex][element] = message[element];
            }
        });

        currencyValues.sort(compareValues('lastChangeBid'));

        //Update the values in the Table
        updateCurrencyTable(currencyTable);

    } else {

        //Push the new currency in currency value
        message.midValues = [];
        message.midValues.push((message.bestBid + message.bestAsk) / 2);
        currencyValues.push(message);
        currencyValues.sort(compareValues('lastChangeBid'));

        //Update the currency table with the new values
        createCurrencyTable(message, currencyTable);
    }
}


/**
 * Desc:: Update the currency table with the new values and sparkline
 * @param currencyTable 
 */
function updateCurrencyTable(currencyTable) {
    let index = 0;

    currencyValues.forEach(function(item) {
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


/**
 * Desc:: Create a new row for the new currency pair
 * @param message 
 * @param currencyTable 
 */
function createCurrencyTable(message, currencyTable) {
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


/**
 * Desc: Compare helper function to compare object on the basis of the key passed
 * @param {*} key 
 */
function compareValues(key) {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0;
        }
        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return comparison;
    };
}


client.connect({}, connectCallback, function(error) {
    alert(error.headers.message)
})
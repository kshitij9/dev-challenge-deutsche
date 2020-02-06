/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
// require('./site/index.html')
    // Apply the styles in style.css to the page.
require('./site/style.css')
var create = require('./core/tableCreation.js');
var update = require('./core/updateCurrency.js');
// if you want to use es6, you can do something like
//     require('./es6/myEs6code')
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = true
var currencyValues = [];
// var midValues = [];
const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url)
client.debug = function(msg) {
    if (global.DEBUG) {}
}

function current(){
    this.todo = [];
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

        currencyValues = update.updateCurrencyValues(currencyMatchIndex, message, currencyValues);

        currencyValues.sort(compareValues('lastChangeBid'));

        //Update the values in the Table
        update.updateCurrencyTable(currencyTable, message, currencyValues);

    } else {
        //Push the new currency in currency value
        currencyValues = create.addCurrencyValues(message, currencyValues);
        currencyValues.sort(compareValues('lastChangeBid'));
        //Update the currency table with the new values
        create.createCurrencyTable(message, currencyTable);
    }
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
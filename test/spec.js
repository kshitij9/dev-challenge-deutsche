var create = require('../core/tableCreation.js');
var update = require('../core/updateCurrency.js');
var insert = require('../core/insertCurrency.js');
// var 
describe('Testing the functionality for adding the currencies', () => {
    let currencyValues = [{ 
        "name": "gbpchf", 
        "bestBid": 1.3430623172689071, 
        "bestAsk": 1.3829729952824652, 
        "openBid": 1.3808234340083165, 
        "openAsk": 1.4443765659916836, 
        "lastChangeAsk": -0.04249453447587337, 
        "lastChangeBid": -0.05718480839531237 ,
        "midValues": []
    }];
    it('should add currency value', () => {
        let item = {
            bestBid: 1,
            bestAsk: 3
        }
        let currencyValues = create.addCurrencyValues(item, []);
        expect(currencyValues.length).toBe(1)
    })
    // ,
    // it('should add a row in currency table', () => {
    //     let currencyTable = document.getElementById('currencyTable');
    //     let message = {
    //         name: "gbpchf", 
    //         bestBid: 1.0, 
    //         bestAsk: 1.3829729952824652, 
    //         openBid: 1.3808234340083165, 
    //         openAsk: 1.4443765659916836, 
    //         lastChangeAsk: -0.04249453447587337, 
    //         lastChangeBid: -0.05718480839531237,
    //         midValues: []
    //     }
    //     create.createCurrencyTable(message, currencyTable);
    //     expect(currencyTable.getElementsByTagName('tr').isPresent()).toBeTruthy();
    // })
    it('should update currency value', () => {
        let message = {
            name: "gbpchf", 
            bestBid: 1.0, 
            bestAsk: 1.3829729952824652, 
            openBid: 1.3808234340083165, 
            openAsk: 1.4443765659916836, 
            lastChangeAsk: -0.04249453447587337, 
            lastChangeBid: -0.05718480839531237
        }
        let updatedCurrencyValue = update.updateCurrencyValues(0, message, currencyValues);
        expect(updatedCurrencyValue.length).toBe(1);
        expect(updatedCurrencyValue[0].bestBid).toBe(1.0);
    })
})

describe('Testing the functionality, insert function', () => {
    it('should add a value to array', () => {
        let insertArray = insert.insert([], 1);
        expect(insertArray.length).toBe(1);
    }),
    it('should remove an added value after 30 seconds', () => {
        let insertArray = insert.insert([], 1);
        setTimeout(function(){
            expect(insertArray.length).toBe(0);
        }, 30000);    
    })
})
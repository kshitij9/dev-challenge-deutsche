/**
 * Desc:: Helper function to push an item into an array that auto removes after
 * 30 secs
 * @param array 
 * @param item 
 */
exports.insert = (array, item) => {
    array.push(item);
    setTimeout(() => {
        const index = array.indexOf(item);
        if(index !== -1){
            array.splice(0, index);
        }
    }, 30000);
    return array;
}
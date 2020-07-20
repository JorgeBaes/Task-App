const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const isEqual = function (value, other) {
    var type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(other)) return false;
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
    var compare = function (item1, item2) {
        var itemType = Object.prototype.toString.call(item1);
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }
        else {
            if (itemType !== Object.prototype.toString.call(item2)) return false;
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }
        }
    };
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }
    return true;

}
const insertDB = (name, value) =>{
    if (value == undefined || value == null) {
        console.error(`Propriety value can't be null or undifined`)
        return
    }
    if(typeof name != typeof ''){
        console.error('Propriety name must be String type')
        return        
    }
    db.set(name, value)
        .write()
}
const redefineItem = insertDB

function pushIntoArray(arrayName){
    const args = Array.from(pushIntoArray.arguments)
    if (typeof arrayName != typeof '') {
        console.error('Propriety arrayName must be String type')
        return
    }
    args.forEach( (el, index) => {
        if(index != 0){
            db.get(arrayName)
              .push(el)
              .write()
        }
    })
    
}
function deleteFromArray_Index(arrayName, index, count = 1){
    if (typeof arrayName != typeof '') {
        console.error('Propriety arrayName must be String type')
        return
    }
    let array = db
        .get(arrayName)
        .value();

    array.splice(index, count);

    db.get(arrayName)
        .assign(array)
        .write();    
}
function deleteFromArray_Item(arrayName, item) {
    if (typeof arrayName != typeof '') {
        console.error('Propriety arrayName must be String type')
        return
    }
    let array = db
        .get(arrayName)
        .value();
    array.forEach((el,index) => {
        if(isEqual(item,el) || el === item){
            array.splice(index,1)
            console.log(el, item)
        }
    })
    db.get(arrayName)
        .assign(array)
        .write();
}
function changeItem(itemName, func){
    if (typeof itemName != typeof '') {
        console.error('Propriety itemName must be String type')
        return
    }
    if (typeof func != typeof function(){}){
        console.error('Propriety func must be a function with one argument')
        return
    }
    let item = db
        .get(itemName)
        .value();
    func(item)
    redefineItem(itemName, item)
}


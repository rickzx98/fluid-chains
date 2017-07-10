'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var generateUUID = exports.generateUUID = function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
};
var batchIn = exports.batchIn = function batchIn(object, next, done) {
    var keys = Object.keys(object);
    batchForObject(keys, object, next, done);
};
function batchForObject(keys, object, next, done) {
    var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (index < keys.length) {
        var value = object[keys[index]];
        next(value, function () {
            batchForObject(keys, object, next, done, ++index);
        });
    } else {
        done();
    }
}
var batch = exports.batch = function batch(array, next, done) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (index < array.length) {
        var value = array[index];
        next(value, function () {
            batch(array, next, done, ++index);
        });
    } else {
        done();
    }
};
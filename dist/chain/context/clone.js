'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clone = clone;
/**
 * Creates a clone for context
 * @param {*} context 
 */
function clone(context, validators) {
    var fields = Object.keys(context);
    fields.forEach(function (field) {
        if (field !== 'addValidator' && field !== 'validate' && field !== 'set') {
            var fieldValue = context[field];
            if (fieldValue instanceof Function) {
                var value = fieldValue();
                copy.set(key, value);
            }
        }
    });
}
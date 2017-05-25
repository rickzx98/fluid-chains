'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ValidateConstructor = exports.ValidateConstructor = function ValidateConstructor(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
};
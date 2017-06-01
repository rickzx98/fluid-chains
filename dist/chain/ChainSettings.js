'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChainStrictModeEnabled = exports.ChainCacheEnabled = undefined;

var _ChainStorage = require('./ChainStorage');

var ChainCacheEnabled = exports.ChainCacheEnabled = function ChainCacheEnabled() {
    (0, _ChainStorage.putConfig)('$cache', true);
};

var ChainStrictModeEnabled = exports.ChainStrictModeEnabled = function ChainStrictModeEnabled() {
    (0, _ChainStorage.putConfig)('$strict', true);
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StrictModeEnabled = exports.CacheEnabled = undefined;

var _ChainStorage = require('./ChainStorage');

var CacheEnabled = exports.CacheEnabled = function CacheEnabled() {
    if (!(0, _ChainStorage.getConfig)()['$strict']) {
        throw new Error('ChainCacheEnabled Failed: Strict mode must be enabled.');
    }
    (0, _ChainStorage.putConfig)('$cache', true);
};

var StrictModeEnabled = exports.StrictModeEnabled = function StrictModeEnabled() {
    (0, _ChainStorage.putConfig)('$strict', true);
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StrictModeEnabled = exports.CacheEnabled = exports.$STRICT = exports.$CACHE = undefined;

var _ChainStorage = require('./ChainStorage');

var $CACHE = exports.$CACHE = '$cache';
var $STRICT = exports.$STRICT = '$strict';
var CacheEnabled = exports.CacheEnabled = function CacheEnabled() {
    if (!(0, _ChainStorage.getConfig)()['$strict']) {
        throw new Error('ChainCacheEnabled Failed: Strict mode must be enabled.');
    }
    (0, _ChainStorage.putConfig)($CACHE, true);
};

var StrictModeEnabled = exports.StrictModeEnabled = function StrictModeEnabled() {
    (0, _ChainStorage.putConfig)($STRICT, true);
};
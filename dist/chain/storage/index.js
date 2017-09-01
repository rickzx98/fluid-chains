'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getChain = getChain;
exports.getChainContext = getChainContext;
exports.putChain = putChain;
exports.putChainContext = putChainContext;
exports.setPutChainPlugin = setPutChainPlugin;
exports.setPutChainContextPlugin = setPutChainContextPlugin;
exports.setGetChainContextPlugin = setGetChainContextPlugin;
exports.setGetChainPlugin = setGetChainPlugin;

var _put = require('./put');

var _get = require('./get');

var _exists = require('./exists');

if (global && !global.storage) {
    global.storage = {};
}

var storage = global.storage;

function getChain(name) {
    return (0, _get.getChain)(storage, name);
}
function getChainContext(chainId, field) {
    return (0, _get.getChainContext)(storage, chainId, field);
}

function putChain(name, chain) {
    (0, _put.putChain)(storage, _exists.exists, name, chain);
}
function putChainContext(chainId, field, value) {
    (0, _put.putChainContext)(storage, chainId, field, value);
}

function setPutChainPlugin(plugin) {
    (0, _put.setPutChainPlugin)(storage, plugin);
}
function setPutChainContextPlugin(plugin) {
    (0, _put.setPutChainContextPlugin)(storage, plugin);
}
function setGetChainContextPlugin(plugin) {
    (0, _get.setGetChainContextPlugin)(storage, plugin);
}
function setGetChainPlugin(plugin) {
    (0, _get.setGetChainPlugin)(storage, plugin);
}
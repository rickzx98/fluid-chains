'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getMiddlewares = exports.putChain = exports.ChainStorage = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChainStorage = exports.ChainStorage = {};

var putChain = exports.putChain = function putChain(name, chain) {
    _lodash2.default.set(ChainStorage, name, function () {
        return chain;
    });
};

var getMiddlewares = exports.getMiddlewares = function getMiddlewares() {
    return _lodash2.default.filter(ChainStorage, function (storage) {
        var chain = storage();
        return chain.type && chain.type === 'MIDDLEWARE';
    });
};
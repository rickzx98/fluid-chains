'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.exists = exports.clearStorage = exports.getConfig = exports.putConfig = exports.getChains = exports.getMiddlewares = exports.getState = exports.removeState = exports.addChainState = exports.createChainState = exports.putChain = exports.ChainStorage = undefined;

var _Chain = require('./Chain');

var _Util = require('./Util');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChainStorage = exports.ChainStorage = {};

var putChain = exports.putChain = function putChain(name, chain) {
    if (_lodash2.default.get(ChainStorage, name)) {
        throw Error('A chain with the same name as "' + name + '" has already been stored.');
    }
    _lodash2.default.set(ChainStorage, name, function () {
        return chain;
    });
};

var createChainState = exports.createChainState = function createChainState(name, spec, param, context) {
    var key = (0, _Util.generateUUID)();
    addChainState(key, name, spec, param, context);
    return key;
};
var addChainState = exports.addChainState = function addChainState(key, name, spec, param, context) {
    var state = {};
    if (spec && spec.length) {
        var params = {};
        spec.forEach(function (chainSpec) {
            _lodash2.default.set(params, chainSpec.field, param[chainSpec.field] ? param[chainSpec.field]() : '');
        });
        _lodash2.default.set(state, 'spec', spec);
        _lodash2.default.set(state, 'params', param);
    }
    _lodash2.default.set(state, 'context', _lodash2.default.clone(context));
    if (!_lodash2.default.get(ChainStorage, key)) {
        _lodash2.default.set(ChainStorage, key, {});
    }
    var chainState = _lodash2.default.get(ChainStorage, key);
    _lodash2.default.set(chainState, name, state);
};

var removeState = exports.removeState = function removeState(key) {
    _lodash2.default.unset(ChainStorage, key);
};
var getState = exports.getState = function getState(key, name, param) {
    var state = _lodash2.default.get(ChainStorage, key);
    var stateChain = _lodash2.default.get(state, name);
    var context = undefined;
    if (stateChain) {
        if (stateChain.spec) {
            var valid = [];
            stateChain.spec.forEach(function (fieldSpec) {
                if (param[fieldSpec.field]) {
                    valid.push(param[fieldSpec.field]() === stateChain.params[fieldSpec.field]());
                } else {
                    valid.push('' === stateChain.params[fieldSpec.field]());
                }
            });
            if (_lodash2.default.filter(valid, function (value) {
                return value;
            }).length === stateChain.spec.length) {
                context = stateChain.context;
            }
        } else {
            context = stateChain.context;
        }
    }
    return context;
};
var getMiddlewares = exports.getMiddlewares = function getMiddlewares() {
    return _lodash2.default.filter(ChainStorage, function (storage) {
        if (storage instanceof Function) {
            var chain = storage();
            return chain.type && chain.type === 'MIDDLEWARE';
        }
    });
};

var getChains = exports.getChains = function getChains() {
    var chains = [];
    _lodash2.default.forEach(ChainStorage, function (storage) {
        if (storage instanceof Function) {
            var chain = storage();
            if (chain instanceof _Chain.CH) {
                chains.push(chain.info().name);
            }
        }
    });
    return chains;
};
var putConfig = exports.putConfig = function putConfig(name, value) {
    _lodash2.default.set(getConfig(), name, value);
};

var getConfig = exports.getConfig = function getConfig() {
    var config = _lodash2.default.get(ChainStorage, '$chain.$config');
    if (!config) {
        _lodash2.default.set(ChainStorage, '$chain.$config', {});
        config = _lodash2.default.get(ChainStorage, '$chain.$config');
    }
    return config;
};

var clearStorage = exports.clearStorage = function clearStorage() {
    _lodash2.default.forIn(ChainStorage, function (field, key) {
        _lodash2.default.unset(ChainStorage, key);
    });
};

var exists = exports.exists = function exists(chainName) {
    return !!_lodash2.default.get(ChainStorage, chainName);
};
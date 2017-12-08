'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Put chain to the storage
 * @param {*} storage
 * @param {function} exists
 * @param {*} name
 * @param {*} chain
 */
var putChain = exports.putChain = function putChain(storage, exists, name, chain) {
    if (exists(name)) {
        throw ChainWithTheSameNameException(name);
    }
    if (storage[PUT_CHAIN_METHOD]) {
        storage[PUT_CHAIN_METHOD](name, chain);
    } else {
        storage[name] = chain;
    }
};

/**
 * Put chain context value to storage
 * @param {*} storage
 * @param {*} chainId
 * @param {*} context
 * @param {*} field
 * @param {*} value
 */
var putChainContext = exports.putChainContext = function putChainContext(storage, chainId, field, value) {
    if (storage[PUT_CHAIN_CONTEXT_METHOD]) {
        storage[PUT_CHAIN_CONTEXT_METHOD](chainId, field, function () {
            return value;
        });
    } else {
        if (!storage[chainId]) {
            storage[chainId] = {};
        }
        var frozenValue = function frozenValue() {
            return Object.freeze(value);
        };
        storage[chainId][field] = frozenValue.bind(storage[chainId]);
    }
};

/**
 * Overrides the put chain function
 * @param {*} storage
 * @param {*} plugin
 */
var setPutChainPlugin = exports.setPutChainPlugin = function setPutChainPlugin(storage, plugin) {
    if (!(plugin instanceof Function)) {
        throw new PutChainTypeException();
    }
    storage[PUT_CHAIN_METHOD] = plugin;
};

/**
 * Overrides the put chain context function
 * @param {*} storage
 * @param {*} plugin
 */
var setPutChainContextPlugin = exports.setPutChainContextPlugin = function setPutChainContextPlugin(storage, plugin) {
    if (!(plugin instanceof Function)) {
        throw new PutChainTypeException();
    }
    storage[PUT_CHAIN_CONTEXT_METHOD] = plugin;
};

var PUT_CHAIN_METHOD = 'PLUGIN_PUT_CHAIN';
var PUT_CHAIN_CONTEXT_METHOD = 'PLUGIN_PUT_CHAIN_CONTEXT';

var PutChainTypeException = function (_Error) {
    _inherits(PutChainTypeException, _Error);

    function PutChainTypeException() {
        _classCallCheck(this, PutChainTypeException);

        return _possibleConstructorReturn(this, (PutChainTypeException.__proto__ || Object.getPrototypeOf(PutChainTypeException)).call(this, 'Put chain plugin must be a function.'));
    }

    return PutChainTypeException;
}(Error);

var ChainWithTheSameNameException = function (_Error2) {
    _inherits(ChainWithTheSameNameException, _Error2);

    function ChainWithTheSameNameException(name) {
        _classCallCheck(this, ChainWithTheSameNameException);

        return _possibleConstructorReturn(this, (ChainWithTheSameNameException.__proto__ || Object.getPrototypeOf(ChainWithTheSameNameException)).call(this, 'A chain with the same name as "' + name + '" has already been stored.'));
    }

    return ChainWithTheSameNameException;
}(Error);
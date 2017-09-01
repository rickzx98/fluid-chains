'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getChain = getChain;
exports.getChainContext = getChainContext;
exports.setGetChainContextPlugin = setGetChainContextPlugin;
exports.setGetChainPlugin = setGetChainPlugin;

var _Util = require('../Util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GET_CHAIN_METHOD = 'GET_CHAIN_PLUGIN';
var GET_CHAIN_CONTEXT_METHOD = 'GET_CHAIN_CONTEXT_PLUGIN';

/**
 * Gets the chain instance from storage
 * @param storage
 * @param name
 */
function getChain(storage, name) {
    if (storage[GET_CHAIN_METHOD]) {
        return storage[GET_CHAIN_METHOD](name);
    }
    var chain = Object.assign({}, storage[name]);
    chain['$chainId'] = (0, _Util.generateUUID)();
    return Object.assign({}, chain);
}
/**
 *  Gets the chain context value from storage
 * @param storage
 * @param chainId
 * @param field
 * @returns {*}
 */
function getChainContext(storage, chainId, field) {
    if (storage[GET_CHAIN_CONTEXT_METHOD]) {
        return storage[GET_CHAIN_CONTEXT_METHOD](chainId, field);
    }
    if (storage[chainId]) {
        return storage[chainId][field];
    }
}

/**
 * Overrides getChainContext method
 * @param storage
 * @param plugin
 */
function setGetChainContextPlugin(storage, plugin) {
    if (!(plugin instanceof Function)) {
        throw new GetChainTypeException();
    } else {
        storage[GET_CHAIN_CONTEXT_METHOD] = plugin;
    }
}
/**
 * Overrides getChain method
 * @param storage
 * @param plugin
 */
function setGetChainPlugin(storage, plugin) {
    if (!(plugin instanceof Function)) {
        throw new GetChainTypeException();
    } else {
        storage[GET_CHAIN_METHOD] = plugin;
    }
}

var GetChainTypeException = function (_Error) {
    _inherits(GetChainTypeException, _Error);

    function GetChainTypeException() {
        _classCallCheck(this, GetChainTypeException);

        return _possibleConstructorReturn(this, (GetChainTypeException.__proto__ || Object.getPrototypeOf(GetChainTypeException)).call(this, 'Get chain plugin must be a function.'));
    }

    return GetChainTypeException;
}(Error);
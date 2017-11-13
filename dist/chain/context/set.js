'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setContextValue = setContextValue;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Sets context value
 * @param isValidJson
 * @param setChainContext
 * @param getChainContext
 * @param context
 * @param chainId
 * @param name
 * @param value
 */
function setContextValue(isValidJson, setChainContext, getChainContext, context, chainId, name, value) {
    if (value instanceof Function) {
        throw new FunctionAsValueException();
    }
    /* TODO: Why?? 
    else if (!isValidJson(value)) {
         throw new InvalidJSONValueException(value);
     } */
    setChainContext(chainId, name, value);
    context[name] = function () {
        return getChainContext(chainId, name);
    };
}

var FunctionAsValueException = function (_Error) {
    _inherits(FunctionAsValueException, _Error);

    function FunctionAsValueException() {
        _classCallCheck(this, FunctionAsValueException);

        return _possibleConstructorReturn(this, (FunctionAsValueException.__proto__ || Object.getPrototypeOf(FunctionAsValueException)).call(this, 'Function cannot be set as value.'));
    }

    return FunctionAsValueException;
}(Error);

var InvalidJSONValueException = function (_Error2) {
    _inherits(InvalidJSONValueException, _Error2);

    function InvalidJSONValueException(value) {
        _classCallCheck(this, InvalidJSONValueException);

        return _possibleConstructorReturn(this, (InvalidJSONValueException.__proto__ || Object.getPrototypeOf(InvalidJSONValueException)).call(this, '{value}  is not a valid json value.'));
    }

    return InvalidJSONValueException;
}(Error);
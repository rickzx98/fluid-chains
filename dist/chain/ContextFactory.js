'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CreateContext = exports.ConvertToContext = exports.CreateErrorContext = undefined;

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _ChainSpec = require('./ChainSpec');

var _ChainSpec2 = _interopRequireDefault(_ChainSpec);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CreateErrorContext = exports.CreateErrorContext = function CreateErrorContext(name, errorFrom, err) {
    var context = new _ChainContext2.default();
    context.addValidator(new _ChainSpec2.default('$err', true, undefined, true));
    context.addValidator(new _ChainSpec2.default('$errorMessage', true, undefined, true));
    context.addValidator(new _ChainSpec2.default('$errorFrom', true, undefined, true));
    context.addValidator(new _ChainSpec2.default('$owner', true, undefined, true));
    context.addValidator(new _ChainSpec2.default('$responseTime', false, undefined, true));
    context.set('$owner', name);
    context.set('$err', err);
    context.set('$errorMessage', err.message);
    context.set('$errorFrom', errorFrom);
    return context;
};

var ConvertToContext = exports.ConvertToContext = function ConvertToContext(param) {
    if (!(param instanceof _ChainContext2.default)) {
        var context = new _ChainContext2.default();
        context.addValidator(new _ChainSpec2.default('$owner', false, undefined, true));
        if (param) {
            _lodash2.default.forIn(param, function (val, key) {
                context.addValidator(new _ChainSpec2.default(key, false, undefined, true));
                if (val instanceof Function) {
                    throw new Error('Param must not contain functions');
                }
                context.set(key, val);
            });
        }
        return context;
    }
    return param;
};

var CreateContext = exports.CreateContext = function CreateContext(original, name, next, error) {
    original.addValidator(new _ChainSpec2.default('$next', false, undefined, true));
    original.addValidator(new _ChainSpec2.default('$error', false, undefined, true));
    original.addValidator(new _ChainSpec2.default('$owner', false, undefined, true));
    var context = original.clone();
    if (error && !context.$error) {
        context.set('$error', error);
    }
    if (next && !context.$next) {
        context.set('$next', next);
    }
    return context;
};
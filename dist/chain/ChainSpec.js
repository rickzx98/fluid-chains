'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChainSpec = function ChainSpec(field, required, customValidator) {
    var _this = this;

    _classCallCheck(this, ChainSpec);

    if (customValidator && !(customValidator instanceof Function)) {
        throw new Error('customValidator must be a Function instance.');
    }
    var specActions = [];

    this.field = field;
    this.required = required;
    this.validate = function (context, done) {
        if (_this.required && (!context[field] || context[field]() === '')) {
            if (done) {
                done(new Error(_this.requiredMessage || 'Field ' + field + ' is required.'));
            } else {
                throw new Error(_this.requiredMessage || 'Field ' + field + ' is required.');
            }
        } else if (customValidator && context[field]) {
            customValidator(context[field](), function (valid, message) {
                if (!valid) {
                    if (done) {
                        done(new Error(message || 'Validation failed for field ' + field));
                    } else {
                        throw new Error(message || 'Validation failed for field ' + field);
                    }
                } else {
                    if (done) {
                        done();
                    }
                }
            });
        } else {
            done();
        }
    };

    this.initDefault = function (context) {
        if (!_lodash2.default.get(context, field)) {
            context.set(field, _this.defaultValue);
        }
    };

    this.initTransformer = function (context, done) {
        var currentValue = _lodash2.default.get(context, field);
        if (currentValue) {
            _this.transformer(currentValue(), function (newValue) {
                context.set(field, newValue);
                done();
            });
        } else {
            done();
        }
    };

    this.initTranslator = function (context) {
        var currentValue = _lodash2.default.get(context, field);
        if (currentValue) {
            var newContext = new _ChainContext2.default();
            _this.translator(currentValue(), newContext);
            context.copy(newContext);
        }
    };

    this.default = function (defaultValue) {
        _this.defaultValue = defaultValue;
        specActions.push('default');
        return _this;
    };

    this.require = function (message) {
        _this.required = true;
        _this.requiredMessage = message;
        specActions.push('require');
        return _this;
    };

    this.validator = function (validator) {
        customValidator = validator;
        if (customValidator && !(customValidator instanceof Function)) {
            throw new Error('customValidator must be a Function instance.');
        }
        specActions.push('validator');
        return _this;
    };

    this.transform = function () {
        var transformer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (currentValue) {
            var done = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (newValue) {};
        };

        _this.transformer = transformer;
        specActions.push('transform');
        return _this;
    };

    this.translate = function () {
        var translator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (currentValue, context) {};

        _this.translator = translator;
        specActions.push('translate');
        return _this;
    };

    this.getSpecsSequence = function () {
        return specActions;
    };
};

exports.default = ChainSpec;
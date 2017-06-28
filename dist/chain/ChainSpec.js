'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChainSpec = function ChainSpec(field, required, customValidator, once) {
    var _this = this;

    _classCallCheck(this, ChainSpec);

    if (customValidator && !(customValidator instanceof Function)) {
        throw new Error('customValidator must be a Function instance.');
    }
    this.field = field;
    this.required = required;
    this.once = once;
    this.validate = function (context) {
        if (_this.required && (!context[field] || context[field]() === '')) {
            throw new Error(_this.requiredMessage || 'Field ' + field + ' is required.');
        }
        if (customValidator && context[field]) {
            customValidator(context[field](), function (valid, message) {
                if (!valid) {
                    throw new Error(message || 'Validation failed for field ' + field);
                }
            });
        }
    };

    this.default = function (defaultValue) {
        _this.defaultValue = defaultValue;
        return _this;
    };

    this.require = function (message) {
        _this.required = true;
        _this.requiredMessage = message;
        return _this;
    };

    this.validator = function (validator) {
        customValidator = validator;
        if (customValidator && !(customValidator instanceof Function)) {
            throw new Error('customValidator must be a Function instance.');
        }
        return _this;
    };

    this.writeOnce = function () {
        _this.once = true;
        return _this;
    };
};

exports.default = ChainSpec;
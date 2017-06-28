'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChainSpec = function ChainSpec(field, required, customValidator, readOnly) {
    _classCallCheck(this, ChainSpec);

    if (customValidator && !(customValidator instanceof Function)) {
        throw new Error('customValidator must be a Function instance.');
    }
    this.field = field;
    this.required = required;
    this.validate = function (context) {
        if (required && (!context[field] || context[field]() === '')) {
            throw new Error('Field ' + field + ' is required.');
        }
        if (customValidator && context[field]) {
            customValidator(context[field](), function (valid, message) {
                if (!valid) {
                    throw new Error(message || 'Validation failed for field ' + field);
                }
            });
        }
    };
    this.readOnly = readOnly;
};

exports.default = ChainSpec;
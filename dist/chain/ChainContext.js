'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChainContext = function () {
    function ChainContext(validators) {
        var _this = this;

        _classCallCheck(this, ChainContext);

        this.validators = validators || {};
        this.addValidator = function (fieldSpec) {
            _this.validators[fieldSpec.field] = fieldSpec;
        };
    }

    _createClass(ChainContext, [{
        key: 'set',
        value: function set(name, value) {
            var fieldSpec = this.validators[name];
            /* if (fieldSpec && fieldSpec.once && lodash.get(this, name)) {
                 throw new Error('Field ' + name + ' is already defined and can only be written once.');
             }*/
            if (value instanceof Function) {
                throw new Error('Function cannot be set as value');
            }
            _lodash2.default.set(this, name, function () {
                return _lodash2.default.clone(value);
            });
        }
    }, {
        key: 'clone',
        value: function clone() {
            var validators = this.validators || {};
            var copy = new ChainContext(validators);
            _lodash2.default.forIn(this, function (field, key) {
                if (key !== 'addValidator' && key !== 'validate' && key !== 'set') {
                    if (field instanceof Function) {
                        var value = field();
                        copy.set(key, value);
                    }
                }
            });
            return copy;
        }
    }, {
        key: 'cloneFor',
        value: function cloneFor(context) {
            if (!(context instanceof ChainContext)) {
                throw new Error('Argument must be an instance of ChainContext');
            }
            var validators = this.validators || {};
            var copy = new ChainContext(validators);
            _lodash2.default.forIn(this, function (field, key) {
                if (key !== 'addValidator' && key !== 'validate' && key !== 'set' && context.validators && context.validators[key]) {
                    if (field instanceof Function) {
                        var value = field();
                        copy.set(key, value);
                    }
                } else if (key === '$error' || key === '$owner' || key === '$errorMessage' || key === '$next' || key === '$err') {
                    var _value = field();
                    copy.set(key, _value);
                }
            });
            return copy;
        }
    }, {
        key: 'merge',
        value: function merge(context) {
            var validators = this.validators || {};
            var copy = new ChainContext(validators);
            _lodash2.default.forIn(this, function (field, key) {
                if (key !== 'addValidator' && key !== 'validate' && key !== 'set') {
                    if (field instanceof Function) {
                        var value = field();
                        copy.set(key, value);
                    }
                } else if (key === '$error' || key === '$owner' || key === '$errorMessage' || key === '$next' || key === '$err') {
                    var _value2 = field();
                    copy.set(key, _value2);
                }
            });

            _lodash2.default.forIn(context, function (field, key) {
                if (key !== 'addValidator' && key !== 'validate' && key !== 'set') {
                    if (field instanceof Function) {
                        var value = field();
                        if (!copy[key]) {
                            copy.set(key, value);
                        }
                    }
                }
            });
            return copy;
        }
    }, {
        key: 'validate',
        value: function validate(param) {
            _lodash2.default.forIn(this.validators, function (validator) {
                return validator.validate(param);
            });
        }
    }, {
        key: 'transform',
        value: function transform(context) {
            var _this2 = this;

            _lodash2.default.forIn(context.validators, function (validator, field) {
                if (validator.transformer) {
                    var currentValue = _lodash2.default.get(_this2, field);
                    if (currentValue) {
                        validator.transformer(currentValue(), function (newValue) {
                            _this2.set(field, newValue);
                        });
                    }
                }
            });
        }
    }, {
        key: 'initDefaults',
        value: function initDefaults(context) {
            var _this3 = this;

            _lodash2.default.forIn(context.validators, function (validator, field) {
                if (validator.defaultValue && !_lodash2.default.get(_this3, field)) {
                    _this3.set(field, validator.defaultValue);
                }
            });
        }
    }]);

    return ChainContext;
}();

exports.default = ChainContext;
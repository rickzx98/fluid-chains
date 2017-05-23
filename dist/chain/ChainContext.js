'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChainContext = function () {
    function ChainContext() {
        var _this = this;

        _classCallCheck(this, ChainContext);

        this.validators = {};
        this.addValidator = function (fieldSpec) {
            _this.validators[fieldSpec.field] = fieldSpec;
        };
    }

    _createClass(ChainContext, [{
        key: 'set',
        value: function set(name, value) {
            var fieldSpec = this.validators[name];
            if (fieldSpec && fieldSpec.immutable && _lodash2.default.get(this, name)) {
                throw new Error('Field ' + name + ' is already defined and is marked immutable.');
            }
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
            var copy = {};
            var validators = _lodash2.default.clone(this.validators) || {};
            _lodash2.default.forIn(this, function (field, key) {
                if (key !== 'addValidator' && key !== 'validate' && key !== 'set') {
                    if (field instanceof Function) {
                        var value = field();
                        _lodash2.default.set(copy, key, function () {
                            return _lodash2.default.clone(value);
                        });
                    }
                }
            });
            copy.set = function (name, value) {
                if (value instanceof Function) {
                    throw new Error('Function cannot be set as value');
                }
                _lodash2.default.set(copy, name, function () {
                    return _lodash2.default.clone(value);
                });
            };
            copy.validate = function () {
                _lodash2.default.forIn(validators, function (validator) {
                    return validator.validate(copy);
                });
            };
            return copy;
        }
    }]);

    return ChainContext;
}();

exports.default = ChainContext;
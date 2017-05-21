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
    function ChainContext(name) {
        var _this = this;

        _classCallCheck(this, ChainContext);

        this.validators = [];
        if (!name) {
            throw new Error('Owner name is required.');
        }
        this.set('$owner', name);
        this.addValidator = function (fieldSpec) {
            _this.validators.push(fieldSpec);
        };
    }

    _createClass(ChainContext, [{
        key: 'set',
        value: function set(name, value) {
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
            var _this2 = this;

            var copy = {};
            var validators = _lodash2.default.clone(this.validators) || [];
            _lodash2.default.forIn(this, function (field, key) {
                if (key !== 'addValidator' && key !== 'validate' && key !== 'set') {
                    if (field instanceof Function) {
                        var value = field();
                        _lodash2.default.set(copy, key, function () {
                            return _lodash2.default.clone(value);
                        });
                    }
                    if (key !== '$owner') {
                        _lodash2.default.unset(_this2, key);
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
                validators.forEach(function (validator) {
                    return validator.validate(copy);
                });
            };
            return copy;
        }
    }]);

    return ChainContext;
}();

exports.default = ChainContext;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Chain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _context = require('./context/');

var _context2 = _interopRequireDefault(_context);

var _executer = require('./executer/');

var _spec = require('./spec/');

var _spec2 = _interopRequireDefault(_spec);

var _Util = require('./Util');

var _storage = require('./storage/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chain = exports.Chain = function () {
    function Chain(name) {
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (parameter) {};

        _classCallCheck(this, Chain);

        this.action = action;
        this.specs = [];
        (0, _storage.putChain)(name, this);
    }

    _createClass(Chain, [{
        key: 'reduce',
        value: function reduce(field) {
            this.reducer = field;
            return this;
        }
    }, {
        key: 'spec',
        value: function spec(field, json) {
            var spec = new _spec2.default(field);
            if (json.require) {
                spec.require(json.requireMessage);
            }
            if (json.default) {
                spec.default(json.default);
            }
            if (json.validate) {
                spec.validate(json.validate);
            }
            if (json.transform) {
                spec.transform(json.transform);
            }
            if (json.translate) {
                spec.translate(json.translate);
            }
            this.specs.push(spec);
            return this;
        }
    }, {
        key: 'strict',
        value: function strict() {
            this.isStrict = true;
            return this;
        }
    }, {
        key: 'cached',
        value: function cached(keyFields) {
            this.isCached = true;
            return this;
        }
    }], [{
        key: 'start',
        value: function start(chains) {
            var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new _executer.Executer().start(param, chains);
        }
    }]);

    return Chain;
}();
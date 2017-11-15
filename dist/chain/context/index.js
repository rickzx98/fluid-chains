'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('../storage/');

var _get = require('./get');

var _validators = require('./validators');

var _Util = require('../Util');

var _set = require('./set');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
    function Context(chainId) {
        _classCallCheck(this, Context);

        this.chainId = chainId;
    }

    _createClass(Context, [{
        key: 'set',
        value: function set(name, value) {
            (0, _set.setContextValue)(_Util.isValidJson, _storage.putChainContext, _storage.getChainContext, this, this.chainId, name, value);
        }
    }, {
        key: 'addValidator',
        value: function addValidator(fieldSpec) {
            new _validators.Validators(this.chainId, _storage.getChainContext).addSpec(fieldSpec, this.set.bind(this));
        }
    }, {
        key: 'getData',
        value: function getData() {
            return new _get.GetContext(this.chainId, _storage.getChain).getContext();
        }
    }, {
        key: 'validate',
        value: function validate() {
            return new _validators.Validators(this.chainId, _storage.getChainContext).runValidations(this);
        }
    }, {
        key: 'runSpecs',
        value: function runSpecs() {
            return new _validators.Validators(this.chainId, _storage.getChainContext).runValidations(this);
        }
    }]);

    return Context;
}();

exports.default = Context;
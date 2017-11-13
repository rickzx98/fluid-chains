'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VALIDATORS = '$$$validators';

var Validators = exports.Validators = function () {
    function Validators(chainId, setChainContextValue, getChainContext) {
        _classCallCheck(this, Validators);

        var context = getChainContext(chainId);
        this.fieldSpecs = context[VALIDATORS] ? context[VALIDATORS]() : [];
    }

    _createClass(Validators, [{
        key: 'addSpec',
        value: function addSpec(fieldSpec) {
            var validators = Object.assign([], [].concat(_toConsumableArray(this.fieldSpecs), [fieldSpec]));
            setChainContextValue(VALIDATORS, validators);
        }
    }]);

    return Validators;
}();
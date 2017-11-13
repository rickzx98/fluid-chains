"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Defaults = exports.Defaults = function () {
    function Defaults(field, specData, context) {
        _classCallCheck(this, Defaults);

        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    _createClass(Defaults, [{
        key: "runDefault",
        value: function runDefault() {
            var defaultValue = this.specData.defaultValue;

            if (defaultValue) {
                this.context.set(this.field, defaultValue);
            }
        }
    }]);

    return Defaults;
}();
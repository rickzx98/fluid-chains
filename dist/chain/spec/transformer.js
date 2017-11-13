"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Transformer = exports.Transformer = function () {
    function Transformer(field, specData, context) {
        _classCallCheck(this, Transformer);

        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    _createClass(Transformer, [{
        key: "runTransform",
        value: function runTransform() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var transformer = _this.specData.transformer;

                if (transformer) {
                    var contextData = _this.context.getData();
                    if (contextData[_this.field]) {
                        transformer(contextData[_this.field]()).then(function (newValue) {
                            _this.context.set(_this.field, newValue);
                            resolve();
                        }).catch(function (error) {
                            reject(error);
                        });
                    } else {
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        }
    }]);

    return Transformer;
}();
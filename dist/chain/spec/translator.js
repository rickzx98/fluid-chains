"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Translator = exports.Translator = function () {
    function Translator(field, specData, context) {
        _classCallCheck(this, Translator);

        this.field = field;
        this.specData = specData;
        this.context = context;
    }

    _createClass(Translator, [{
        key: "runTranslate",
        value: function runTranslate() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var translator = _this.specData.translator;

                if (translator) {
                    var contextData = _this.context.getData();
                    if (contextData[_this.field]) {
                        translator(contextData[_this.field](), _this.context).then(function () {
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

    return Translator;
}();
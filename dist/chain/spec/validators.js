'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validators = exports.Validators = function () {
    function Validators(field, contextData, specData) {
        _classCallCheck(this, Validators);

        this.field = field;
        this.contextData = contextData;
        this.specData = specData;
    }

    _createClass(Validators, [{
        key: 'runValidation',
        value: function runValidation() {
            var _this = this;

            var _specData = this.specData,
                required = _specData.required,
                requireMessage = _specData.requireMessage,
                validator = _specData.validator;

            return new Promise(function (resolve, reject) {
                if (required && (!_this.contextData[_this.field] || _this.contextData[_this.field] === '')) {
                    reject(new Error(requireMessage || 'Field ' + _this.field + ' is required.'));
                } else if (validator && _this.contextData[_this.field]) {
                    validator.then(function () {
                        resolve();
                    }).catch(function (error) {
                        reject(error);
                    });
                } else {
                    resolve();
                }
            });
        }
    }]);

    return Validators;
}();
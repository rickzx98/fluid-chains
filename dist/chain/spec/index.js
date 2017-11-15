'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _defaults = require('./defaults');

var _transformer = require('./transformer');

var _translator = require('./translator');

var _validators = require('./validators');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spec = function () {
    function Spec(field) {
        _classCallCheck(this, Spec);

        this.field = field;
        this.actions = [];
        this.data = {};
        classValidation(this);
    }

    _createClass(Spec, [{
        key: 'default',
        value: function _default(defaultValue) {
            addAction(this, 'default');
            this.data = _extends({}, this.data, { defaultValue: defaultValue });
        }
    }, {
        key: 'require',
        value: function require(requireMessage) {
            addAction(this, 'require');
            this.data = _extends({}, this.data, { require: true, requireMessage: requireMessage });
        }
    }, {
        key: 'validate',
        value: function validate() {
            var validator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (currentValue) {
                return new Promise();
            };

            addAction(this, 'validate');
            this.data = _extends({}, this.data, { validator: validator });
        }
    }, {
        key: 'transform',
        value: function transform() {
            var transformer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (currentValue) {
                return new Promise();
            };

            addAction(this, 'transform');
            this.data = _extends({}, this.data, { transformer: transformer });
        }
    }, {
        key: 'translate',
        value: function translate() {
            var translator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (currentValue, context) {
                return new Promise();
            };

            addAction(this, 'translate');
            this.data = _extends({}, this.data, { translator: translator });
        }
    }, {
        key: 'runValidation',
        value: function runValidation(context) {
            return new _validators.Validators(this.field, context.getData(), this.data).runValidation();;
        }
    }, {
        key: 'runDefault',
        value: function runDefault(context) {
            return new _defaults.Defaults(this.field, this.data, context).runDefault();
        }
    }, {
        key: 'runTransform',
        value: function runTransform(context) {
            return new _transformer.Transformer(this.field, this.data, context).runTransform();
        }
    }, {
        key: 'runTranslate',
        value: function runTranslate(context) {
            return new _translator.Translator(this.field, this.data, context).runTranslate();
        }
    }]);

    return Spec;
}();

exports.default = Spec;


function addAction(spec, actionName) {
    spec.actions.push(actionName);
}
function classValidation(spec) {
    if (!spec.field) {
        throw new Error('Field name is required.');
    }
}
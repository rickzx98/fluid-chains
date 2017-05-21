'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ChainSpec = exports.Execute = exports.CH = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChainStorage = require('./ChainStorage');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _ChainMiddleware = require('./ChainMiddleware');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectSizeof = require('object-sizeof');

var _objectSizeof2 = _interopRequireDefault(_objectSizeof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATUS_IN_PROGRESS = 'IN_PROGRESS';
var STATUS_UNTOUCHED = 'UNTOUCHED';
var STATUS_DONE = 'DONE';
var STATUS_FAILED = 'FAILED';
var STATUS_TERMINATED = 'TERMINATED';

var CH = exports.CH = function () {
    function CH(name, action, next, error) {
        var _this = this;

        _classCallCheck(this, CH);

        validate(name, action);
        var status = STATUS_UNTOUCHED;
        var context = new _ChainContext2.default(name);
        this.spec = [];
        if (error) {
            context.set('$error', error);
        }
        (0, _ChainStorage.putChain)(name, this);
        this.terminate = function () {
            context.set('$isTerminated', true);
        };
        this.execute = function (done, pr) {
            context = new _ChainContext2.default(name);
            var param = pr && pr.clone ? pr.clone() : pr;
            status = STATUS_IN_PROGRESS;
            (0, _ChainMiddleware.RunMiddleware)(param, function (errMiddleware) {
                if (errMiddleware) {
                    done({
                        $error: function $error() {
                            return errMiddleware;
                        },
                        $errorMessage: function $errorMessage() {
                            return errMiddleware && errMiddleware.message;
                        }
                    });
                } else {
                    if (param) {
                        param.validate();
                    }
                    if (param && param.$error && !context.$error) {
                        context.set('$error', param.$error());
                    }
                    if (context.$isTerminated && context.$isTerminated()) {
                        status = STATUS_TERMINATED;
                        done(context);
                    } else {
                        _lodash2.default.defer(function () {
                            try {
                                action(context, param, function () {
                                    if (next) {
                                        if (context.$isTerminated && context.$isTerminated()) {
                                            status = STATUS_TERMINATED;
                                            done(context);
                                        } else {
                                            _lodash2.default.clone(_ChainStorage.ChainStorage[next]()).execute(done, context);
                                        }
                                    } else {
                                        done(context);
                                    }
                                    status = STATUS_DONE;
                                });
                            } catch (err) {
                                status = STATUS_FAILED;
                                if (context.$error) {
                                    context.set('$errorMessage', err.message);
                                    context.set('$name', name);
                                    _lodash2.default.clone(_ChainStorage.ChainStorage[context.$error()]()).execute(done, context);
                                } else {
                                    done({
                                        $error: function $error() {
                                            return err;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        };
        this.status = function () {
            return status;
        };
        this.info = function () {
            return {
                name: name,
                status: status,
                next: next,
                errorHandler: error
            };
        };
        this.addSpec = function (field, required, customValidator) {
            var spec = new ChainSpec(field, required, customValidator);
            _this.spec.push(spec);
            context.addValidator(spec);
        };
    }

    _createClass(CH, [{
        key: 'size',
        value: function size() {
            return (0, _objectSizeof2.default)(this);
        }
    }]);

    return CH;
}();

var Execute = exports.Execute = function Execute(name, param, done) {
    if (!_ChainStorage.ChainStorage[name]) {
        throw new Error('Chain ' + name + ' does not exist.');
    }
    var context = new _ChainContext2.default('starter');
    if (param) {
        var keys = _lodash2.default.keys(param);
        keys.forEach(function (key) {
            var val = _lodash2.default.get(param, key);
            if (val instanceof Function) {
                throw new Error('Param must not contain functions');
            }
            context.set(key, val);
        });
    }
    if (_ChainStorage.ChainStorage[name]) {
        var chain = _lodash2.default.clone(_lodash2.default.get(_ChainStorage.ChainStorage, name)());
        chain.execute(done, context);
    };
};

var ChainSpec = exports.ChainSpec = function ChainSpec(field, required, customValidator) {
    _classCallCheck(this, ChainSpec);

    if (customValidator && !(customValidator instanceof Function)) {
        throw new Error('customValidator must be a Function instance.');
    }
    this.field = field;
    this.required = required;
    this.validate = function (context) {
        if (required && (!context[field] || context[field]() === '')) {
            throw new Error('Field ' + field + ' is required.');
        }
        if (customValidator && context[field]) {
            customValidator(context[field](), function (valid, message) {
                if (!valid) {
                    throw new Error(message || 'Validation failed for field ' + field);
                }
            });
        }
    };
};

function validate(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
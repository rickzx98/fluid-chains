'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Execute = exports.CH = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChainStorage = require('./ChainStorage');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

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
        _classCallCheck(this, CH);

        validate(name, action);
        var status = STATUS_UNTOUCHED;
        var context = new _ChainContext2.default(name);
        if (error) {
            context.set('$error', error);
        }
        (0, _ChainStorage.putChain)(name, this);
        this.terminate = function () {
            context.set('$isTerminated', true);
        };
        this.execute = function (done, param) {
            status = STATUS_IN_PROGRESS;
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
                                _ChainStorage.ChainStorage[next]().execute(done, context);
                            } else {
                                done(context);
                            }
                            status = STATUS_DONE;
                        });
                    } catch (err) {
                        status = STATUS_FAILED;
                        if (context.$error) {
                            context.set('$errorMessage', err);
                            context.set('$name', name);
                            _ChainStorage.ChainStorage[context.$error()]().execute(done, context);
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
    _ChainStorage.ChainStorage[name]().execute(done, context);
};

function validate(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ChainStorage = require('./ChainStorage');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STATUS_IN_PROGRESS = 'IN_PROGRESS';
var STATUS_UNTOUCHED = 'UNTOUCHED';
var STATUS_DONE = 'DONE';
var STATUS_FAILED = 'FAILED';
var STATUS_TERMINATED = 'TERMINATED';

var Chain = function Chain(name, action, next, error) {
    _classCallCheck(this, Chain);

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
};

exports.default = Chain;


function validate(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
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
    var context = new _ChainContext2.default();
    context.set('$owner', name);
    var responseTime = 0;
    this.spec = [];
    this.terminate = function () {
      context.set('$isTerminated', true);
    };
    this.execute = function (done, pr, nxt) {
      context = CreateContext(context, name, next, error);
      var param = ConvertToContext(pr).clone();
      status = STATUS_IN_PROGRESS;
      (0, _ChainMiddleware.RunMiddleware)(param, function (errMiddleware) {
        if (errMiddleware) {
          done({
            $err: function $err() {
              return errMiddleware;
            },
            $errorMessage: function $errorMessage() {
              return errMiddleware && errMiddleware.message;
            }
          });
        } else {
          if (param) {
            context.validate(param);
          }
          if (param && param.$error && !context.$error) {
            context.set('$error', param.$error());
          }
          if (context.$isTerminated && context.$isTerminated()) {
            status = STATUS_TERMINATED;
            var clonedContext = context.clone();
            done(clonedContext);
          } else {
            _lodash2.default.defer(function () {
              var startTime = new Date().getTime();
              try {
                action(context, param, function (err) {
                  if (err && err instanceof Error) {
                    failed(done, context, name, err);
                  } else {
                    status = STATUS_DONE;
                    if (context.$next && context.$next()) {
                      if (context.$isTerminated && context.$isTerminated()) {
                        status = STATUS_TERMINATED;
                        context.set('$responseTime', new Date().getTime() - startTime);
                        var _clonedContext = context.clone();
                        done(_clonedContext);
                      } else {
                        context.set('$responseTime', new Date().getTime() - startTime);
                        _lodash2.default.clone(_ChainStorage.ChainStorage[context.$next()]()).execute(done, context);
                      }
                    } else {
                      context.set('$responseTime', new Date().getTime() - startTime);
                      var _clonedContext2 = context.clone();
                      done(_clonedContext2);
                    }
                  }
                });
              } catch (err) {
                context.set('$responseTime', new Date().getTime() - startTime);
                failed(done, context, name, err);
              }
            });
          }
        }
      }, nxt || next);
    };
    this.status = function () {
      return status;
    };
    this.info = function () {
      return {
        name: name,
        status: status,
        next: next,
        errorHandler: error,
        responseTime: context.$responseTime ? context.$responseTime() : 0
      };
    };
    this.addSpec = function (field, required, customValidator) {
      var spec = new ChainSpec(field, required, customValidator);
      _this.spec.push(spec);
      context.addValidator(spec);
    };

    function failed(done, context, name, err) {
      status = STATUS_FAILED;
      if (context.$error) {
        _lodash2.default.clone(_ChainStorage.ChainStorage[context.$error()]()).execute(done, CreateErrorContext(context.$error(), name, err));
      } else {
        console.warn('UnhandledErrorCallback', err);
        done({
          $err: function $err() {
            return err;
          },
          $errorMessage: function $errorMessage() {
            return err ? err.message : '';
          }
        });
      }
    }
    (0, _ChainStorage.putChain)(name, this);
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
  var context = ConvertToContext(param);
  context.set('$owner', name + '_starter');
  if (_ChainStorage.ChainStorage[name]) {
    var chain = _lodash2.default.clone(_lodash2.default.get(_ChainStorage.ChainStorage, name)());
    chain.execute(done, context, name);
  }
};

var ChainSpec = exports.ChainSpec = function ChainSpec(field, required, customValidator, immutable) {
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
  this.immutable = immutable;
};

function validate(name, action) {
  if (!name) {
    throw new Error('Name is required.');
  }
  if (!action) {
    throw new Error('Action (Function) is required.');
  }
}
function CreateContext(original, name, next, error) {
  original.addValidator(new ChainSpec('$next', false, undefined, true));
  original.addValidator(new ChainSpec('$error', false, undefined, true));
  original.addValidator(new ChainSpec('$owner', false, undefined, true));
  var context = original.clone();
  if (error && !context.$error) {
    context.set('$error', error);
  }
  if (next && !context.$next) {
    context.set('$next', next);
  }
  return context;
}
function CreateErrorContext(name, errorFrom, err) {
  var context = new _ChainContext2.default();
  context.addValidator(new ChainSpec('$err', true, undefined, true));
  context.addValidator(new ChainSpec('$errorMessage', true, undefined, true));
  context.addValidator(new ChainSpec('$errorFrom', true, undefined, true));
  context.addValidator(new ChainSpec('$owner', true, undefined, true));
  context.addValidator(new ChainSpec('$responseTime', false, undefined, true));
  context.set('$owner', name);
  context.set('$err', err);
  context.set('$errorMessage', err.message);
  context.set('$errorFrom', errorFrom);
  return context;
}
function ConvertToContext(param) {
  if (!(param instanceof _ChainContext2.default)) {
    var context = new _ChainContext2.default();
    context.addValidator(new ChainSpec('$owner', false, undefined, true));
    if (param) {
      _lodash2.default.forIn(param, function (val, key) {
        context.addValidator(new ChainSpec(key, false, undefined, true));
        if (val instanceof Function) {
          throw new Error('Param must not contain functions');
        }
        context.set(key, val);
      });
    }
    return context;
  }
  return param;
}
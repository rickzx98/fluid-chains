'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CH = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChainStorage = require('./ChainStorage');

var _ContextFactory = require('./ContextFactory');

var _ChainStatus = require('./ChainStatus.js');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _ChainSpec = require('./ChainSpec');

var _ChainSpec2 = _interopRequireDefault(_ChainSpec);

var _ChainMiddleware = require('./ChainMiddleware');

var _Validation = require('./Validation');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectSizeof = require('object-sizeof');

var _objectSizeof2 = _interopRequireDefault(_objectSizeof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CH = exports.CH = function () {
  function CH(name, action, next, error) {
    var _this = this;

    _classCallCheck(this, CH);

    (0, _Validation.ValidateConstructor)(name, action);
    var status = _ChainStatus.STATUS_UNTOUCHED;
    var context = new _ChainContext2.default();
    context.set('$owner', name);
    this.spec = [];
    this.terminate = function () {
      context.set('$isTerminated', true);
    };
    this.execute = function (done, pr, nxt, belt) {
      context = (0, _ContextFactory.CreateContext)(context, name, belt ? nxt : next, error);
      var param = !!(0, _ChainStorage.getConfig)()['$strict'] ? (0, _ContextFactory.ConvertToContext)(pr).cloneFor(context) : (0, _ContextFactory.ConvertToContext)(pr).clone();
      status = _ChainStatus.STATUS_IN_PROGRESS;
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
          context.validate(param);
          if (param && param.$error && !context.$error) {
            context.set('$error', param.$error());
          }
          if (context.$isTerminated && context.$isTerminated()) {
            status = _ChainStatus.STATUS_TERMINATED;
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
                    status = _ChainStatus.STATUS_DONE;
                    if (belt && nxt) {
                      context.set('$responseTime', new Date().getTime() - startTime);
                      _lodash2.default.clone(_ChainStorage.ChainStorage[nxt]()).execute(done, context);
                    } else if (!belt && context.$next && context.$next()) {
                      if (context.$isTerminated && context.$isTerminated()) {
                        status = _ChainStatus.STATUS_TERMINATED;
                        ChainResponse(done, context, startTime);
                      } else {
                        context.set('$responseTime', new Date().getTime() - startTime);
                        _lodash2.default.clone(_ChainStorage.ChainStorage[context.$next()]()).execute(done, context);
                      }
                    } else {
                      ChainResponse(done, context, startTime);
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
      }, belt ? nxt : nxt || next);
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
      var spec = new _ChainSpec2.default(field, required, customValidator);
      _this.spec.push(spec);
      context.addValidator(spec);
    };
    function failed(done, context, name, err) {
      status = _ChainStatus.STATUS_FAILED;
      if (context.$error) {
        _lodash2.default.clone(_ChainStorage.ChainStorage[context.$error()]()).execute(done, (0, _ContextFactory.CreateErrorContext)(context.$error(), name, err));
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

var ChainResponse = function ChainResponse(done, context, startTime) {
  context.set('$responseTime', new Date().getTime() - startTime);
  var clonedContext = context.clone();
  done(clonedContext);
};
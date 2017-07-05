'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Action = exports.Chain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChainSettings = require('./ChainSettings');

var _ChainStorage = require('./ChainStorage');

var _ContextFactory = require('./ContextFactory');

var _ChainStatus = require('./ChainStatus');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _ChainSpec = require('./ChainSpec');

var _ChainSpec2 = _interopRequireDefault(_ChainSpec);

var _middleware = require('../middleware/');

var _Validation = require('./Validation');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectSizeof = require('object-sizeof');

var _objectSizeof2 = _interopRequireDefault(_objectSizeof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Chain = exports.Chain = function () {
  function Chain(name, action, next, error) {
    var _this = this;

    _classCallCheck(this, Chain);

    (0, _Validation.ValidateConstructor)(name, action);
    var context = new _ChainContext2.default();
    context.set('$owner', name);
    context.set('$$chain.status', _ChainStatus.STATUS_UNTOUCHED);
    context.set('$$chain.next', next);
    context.set('$$chain.name', name);
    context.set('$$chain.error', error);
    this.spec = [];
    this.terminate = function () {
      context.set('$isTerminated', true);
    };
    this.execute = function (done, pr, nxt, belt) {
      var cacheEnabled = !!(0, _ChainStorage.getConfig)()[_ChainSettings.$CACHE];
      context = (0, _ContextFactory.CreateContext)(context, name, belt ? nxt : next, error);
      var param = !!(0, _ChainStorage.getConfig)()[_ChainSettings.$STRICT] ? (0, _ContextFactory.ConvertToContext)(pr).cloneFor(context) : (0, _ContextFactory.ConvertToContext)(pr).clone();
      context.set('$$chain.status', _ChainStatus.STATUS_IN_PROGRESS);
      invokeChain(done, name, next, action, _this.spec, context, param, nxt, belt, cacheEnabled);
    };
    this.status = function () {
      return context.$$chain.status();
    };
    this.info = function () {
      return {
        name: name,
        status: context.$$chain.status(),
        next: next,
        errorHandler: error,
        responseTime: context.$responseTime ? context.$responseTime() : 0
      };
    };
    this.addSpec = function (field, required, customValidator) {
      var spec = new _ChainSpec2.default(field, required, customValidator);
      _this.spec.push(spec);
      context.addValidator(spec);
      return new SpecWrapper(spec);
    };
    (0, _ChainStorage.putChain)(name, this);
  }

  _createClass(Chain, [{
    key: 'size',
    value: function size() {
      return (0, _objectSizeof2.default)(this);
    }
  }]);

  return Chain;
}();

var SpecWrapper = function SpecWrapper(spec) {
  var _this2 = this;

  _classCallCheck(this, SpecWrapper);

  this.require = function (message) {
    spec.require(message);
    return _this2;
  };

  this.validator = function (validator) {
    spec.validator(validator);
    return _this2;
  };

  this.transform = function (transformer) {
    spec.transform(transformer);
    return _this2;
  };

  this.default = function (defaultValue) {
    spec.default(defaultValue);
    return _this2;
  };
};

var ChainResponse = function ChainResponse(done, context, startTime) {
  context.set('$responseTime', new Date().getTime() - startTime);
  var clonedContext = context.clone();
  if ((0, _ChainStorage.getConfig)()[_ChainSettings.$CACHE] && context.$$chain && context.$$chain.id) {
    (0, _ChainStorage.removeState)(context.$$chain.id);
  }
  done(clonedContext);
};
var failed = function failed(done, context, name, err) {
  context.set('$$chain.status', _ChainStatus.STATUS_FAILED);
  if (context.$error) {
    _lodash2.default.clone(_ChainStorage.ChainStorage[context.$error()]()).execute(done, (0, _ContextFactory.CreateErrorContext)(context.$error(), name, err, context.$next()));
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
};

function invokeChain(done, name, next, action, spec, context, param, nxt, belt, cacheEnabled) {
  (0, _middleware.RunMiddleware)(name, param.clone(), context, function (errMiddleware) {
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

      param.initDefaults(context);
      param.transform(context);
      context.validate(param);

      if (param && param.$error && !context.$error) {
        context.set('$error', param.$error());
      }
      if (context.$isTerminated && context.$isTerminated()) {
        context.set('$$chain.status', _ChainStatus.STATUS_TERMINATED);
        var clonedContext = context.clone();
        done(clonedContext);
      } else {
        _lodash2.default.defer(function () {
          var startTime = new Date().getTime();
          try {
            if (cacheEnabled && param.$$chain && param.$$chain.id) {
              var key = param.$$chain.id;
              if ((0, _ChainStorage.getState)(key, name, param)) {
                var cachedContext = (0, _ChainStorage.getState)(key, name, param).clone();
                concludeNextAction(cachedContext, param, belt, startTime, done);
              } else {
                invokeAction(action, name, spec, context, param, belt, cacheEnabled, startTime, done);
              }
            } else {
              invokeAction(action, name, spec, context, param, belt, cacheEnabled, startTime, done);
            }
          } catch (err) {
            context.set('$responseTime', new Date().getTime() - startTime);
            failed(done, context, name, err);
          }
        });
      }
    }
  });
}

function invokeAction(action, name, spec, context, param, belt, cacheEnabled, startTime, done) {
  var asyncAction = action.length === 3;
  action(context, param, function (err) {
    if (err && err instanceof Error) {
      failed(done, context, name, err);
    } else {
      if (cacheEnabled) {
        var key = void 0;
        if (!param.$$chain || !param.$$chain.id) {
          key = (0, _ChainStorage.createChainState)(name, spec, param, context);
        } else {
          key = param.$$chain.id;
          (0, _ChainStorage.addChainState)(key, name, spec, param, context);
        }
        context.set('$$chain.id', key);
      }
      concludeNextAction(context, param, belt, startTime, done);
    }
  });
  if (!asyncAction) {
    if (cacheEnabled) {
      var key = void 0;
      if (!param.$$chain || !param.$$chain.id) {
        key = (0, _ChainStorage.createChainState)(name, spec, param, context);
      } else {
        key = param.$$chain.id;
        (0, _ChainStorage.addChainState)(key, name, spec, param, context);
      }
      context.set('$$chain.id', key);
    }
    concludeNextAction(context, param, belt, startTime, done);
  }
}

function concludeNextAction(context, param, belt, startTime, done) {
  context.set('$$chain.status', _ChainStatus.STATUS_DONE);
  if (!belt && context.$next) {
    if (context.$isTerminated && context.$isTerminated()) {
      context.set('$$chain.status', _ChainStatus.STATUS_TERMINATED);
      ChainResponse(done, context, startTime);
    } else {
      context.set('$responseTime', new Date().getTime() - startTime);
      _lodash2.default.clone(_ChainStorage.ChainStorage[context.$next()]()).execute(done, context);
    }
  } else {
    ChainResponse(done, context, startTime);
  }
}

var Action = exports.Action = function Action(target, key, descriptor) {
  var chain = void 0;
  if (target) {
    _lodash2.default.set(target, 'CHAIN_' + key.toUpperCase(), key);
  }
  if (descriptor && descriptor.value instanceof Function) {
    chain = new Chain(key, descriptor.value);
  } else {
    throw new Error('Must be declared in a function with (context, paran, next).');
  }
  return chain;
};
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Execute = undefined;

var _ChainStorage = require('./ChainStorage');

var _ContextFactory = require('./ContextFactory');

var _ChainContext = require('./ChainContext');

var _ChainContext2 = _interopRequireDefault(_ChainContext);

var _middleware = require('../middleware/');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Execute = exports.Execute = function Execute(name, param) {
  var done = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

  var context = (0, _ContextFactory.ConvertToContext)(param);
  context.set('$owner', 'starter');
  if (name instanceof Array) {
    ExecuteChains(name, done, 0, context);
  } else if ((0, _ChainStorage.exists)(name)) {
    var chain = _lodash2.default.clone(_lodash2.default.get(_ChainStorage.ChainStorage, name)());
    chain.execute(done, context);
  } else {
    var cc = (0, _ContextFactory.CreateContext)(new _ChainContext2.default(), name);
    (0, _middleware.RunMiddleware)(name, param, cc, function (err) {
      if (err) {
        throw err;
      }
      done(cc);
    });
  }
};

function handleError(context, err) {
  if (err) {
    context.set('$err', err);
    context.set('$errorMessage', err.message);
  }
}

function ExecuteChains(chains, done, index, originalParam, newParam) {
  if (index < chains.length) {
    if ((0, _ChainStorage.exists)(chains[index])) {
      var chain = _lodash2.default.clone(_lodash2.default.get(_ChainStorage.ChainStorage, chains[index])());
      var next = nextChain(chains, index);
      chain.execute(function (result) {
        return ExecuteChains(chains, done, ++index, originalParam, originalParam.merge(result));
      }, newParam || originalParam, next, true);
    } else {
      var _next = nextChain(chains, index);
      var context = (0, _ContextFactory.CreateContext)(new _ChainContext2.default(), chains[index], _next);
      (0, _middleware.RunMiddleware)(chains[index], newParam || originalParam, context, function (err) {
        if (err) {
          throw err;
        }
        ExecuteChains(chains, done, ++index, originalParam, originalParam.merge(context));
      });
    }
  } else {
    done(newParam);
  }
}

function nextChain(chains, index) {
  var nextIndex = index + 1;
  if (chains.length > nextIndex) {
    return chains[nextIndex];
  }
  return undefined;
}
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RunMiddleware = exports.Middleware = undefined;

var _MiddlewareStorage = require('./MiddlewareStorage');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Middleware = exports.Middleware = function Middleware(name, callback) {
  _classCallCheck(this, Middleware);

  var action = void 0;
  if (name instanceof Function && !callback) {
    action = name;
    this.target = /.*/g;
  } else if (callback instanceof Function) {
    action = callback;
    this.target = name;
  }
  validate(name, action);
  this.type = 'MIDDLEWARE';
  this.execute = function (done, param, context) {
    try {
      action(param, context, done);
    } catch (err) {
      done(err);
    }
  };
  (0, _MiddlewareStorage.addMiddleware)(this);
};

var RunMiddleware = exports.RunMiddleware = function RunMiddleware(chain, param, context, done) {
  var middlewares = (0, _MiddlewareStorage.getMiddlewares)();
  if (middlewares && middlewares.length) {
    runMiddleware(chain, middlewares, param, context, done);
  } else {
    done();
  }
};

function runMiddleware(chain, middlewares, param, context, done, index) {
  if (!index) {
    index = 0;
  }
  try {
    if (index < middlewares.length) {
      var middleware = middlewares[index];
      if (middleware.target instanceof RegExp && chain.match(middleware.target) || middleware.target === chain) {
        middleware.execute(function (err) {
          if (err) {
            done(err);
          } else {
            runMiddleware(chain, middlewares, param, context, done, ++index);
          }
        }, param, context);
      } else {
        runMiddleware(chain, middlewares, param, context, done, ++index);
      }
    } else {
      done();
    }
  } catch (err) {
    done(err);
  }
}

function validate(name, action) {
  if (!action) {
    throw new Error('Action (Function) is required.');
  }
}
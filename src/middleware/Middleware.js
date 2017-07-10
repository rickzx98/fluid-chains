import {
  addMiddleware,
  getMiddlewares
} from './MiddlewareStorage';

import lodash from 'lodash';

export class Middleware {
  constructor(name, callback) {
    let action;
    if (name instanceof Function && !callback) {
      action = name;
      this.target = /.*/g;
    } else if (callback instanceof Function) {
      action = callback;
      this.target = name;
    }
    validate(name, action);
    this.type = 'MIDDLEWARE';
    this.execute = (done, param, context) => {
      try {
        action(param, context, done);
      } catch (err) {
        done(err);
      }
    }
    addMiddleware(this);
  }
}

export const RunMiddleware = (chain, param, context, done) => {
  const middlewares = getMiddlewares();
  if (middlewares && middlewares.length) {
    runMiddleware(chain, middlewares, param, context, done);
  } else {
    done();
  }
}

function runMiddleware(chain, middlewares, param, context, done, index) {
  if (!index) {
    index = 0;
  }
  try {
    if (index < middlewares.length) {
      const middleware = middlewares[index];
      if ((middleware.target instanceof RegExp && chain.match(middleware.target)) || middleware.target === chain) {
        middleware.execute((err) => {
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
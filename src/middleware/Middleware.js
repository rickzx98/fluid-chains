import { addMiddleware, getMiddlewares } from './MiddlewareStorage';

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
        this.execute = (done, param, next) => {
            lodash.defer(() => {
                try {
                    action(param, next, done);
                } catch (err) {
                    done(err);
                }
            });
        }
        addMiddleware(this);
    }
}

export const RunMiddleware = (chain, param, done, next) => {
    const middlewares = getMiddlewares();
    if (middlewares && middlewares.length) {
        runMiddleware(chain, middlewares, param, done, next);
    } else {
        done();
    }
}
function runMiddleware(chain, middlewares, param, done, next, index) {
    if (!index) {
        index = 0;
    }
    try {
        if (index < middlewares.length) {
            const middleware = middlewares[index];
            if ((middleware.target instanceof RegExp && middleware.target.test(chain)) || middleware.target === chain) {
                lodash.clone(middlewares[index]).execute((err) => {
                    if (err) {
                        done(err);
                    } else {
                        index++;
                        runMiddleware(chain, middlewares, param, done, next, index);
                    }
                }, param, next);
            } else {
                runMiddleware(chain, middlewares, param, done, next, ++index);
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
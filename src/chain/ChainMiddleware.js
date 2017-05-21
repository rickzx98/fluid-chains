import { getMiddlewares, putChain } from './ChainStorage';

import ChainContext from './ChainContext';
import lodash from 'lodash';

export class CM {
    constructor(name, action) {
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
        putChain(name, this);
    }
}

export const RunMiddleware = (param, done, next) => {
    const middlewares = getMiddlewares();
    if (middlewares && middlewares.length) {
        runMiddleware(middlewares, param, done, next);
    } else {
        done();
    }
}
function runMiddleware(middlewares, param, done, next, index) {
    if (!index) {
        index = 0;
    }
    try {
        if (index < middlewares.length) {
            lodash.clone(middlewares[index]()).execute((err) => {
                if (err) {
                    done(err);
                } else {
                    index++;
                    runMiddleware(middlewares, param, done, next, index);
                }
            }, param, next);
        } else {
            done();
        }
    } catch (err) {
        done(err);
    }

}
function validate(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
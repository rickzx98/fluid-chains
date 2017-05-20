import { getMiddlewares, putChain } from './ChainStorage';

import ChainContext from './ChainContext';
import lodash from 'lodash';

export class CM {
    constructor(name, action) {
        validate(name, action);
        this.type = 'MIDDLEWARE';
        this.execute = (done, param) => {
            lodash.defer(() => {
                try {
                    action(param, done);
                } catch (err) {
                    done(err);
                }
            });
        }
        putChain(name, this);
    }
}

export const RunMiddleware = (param, done) => {
    const middlewares = getMiddlewares();
    if (middlewares && middlewares.length) {
        runMiddleware(middlewares, param, done);
    } else {
        done();
    }
}
function runMiddleware(middlewares, param, done, index) {
    if (!index) {
        index = 0;
    }
    try {
        if (index < middlewares.length) {
            middlewares[index]().execute((err) => {
                if (err) {
                    done(err);
                } else {
                    index++;
                    runMiddleware(middlewares, param, done, index);
                }
            }, param);
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
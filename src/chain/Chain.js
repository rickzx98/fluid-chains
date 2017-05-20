import { ChainStorage, putChain } from './ChainStorage';

import ChainContext from './ChainContext';
import lodash from 'lodash';
import sizeOf from 'object-sizeof';

const STATUS_IN_PROGRESS = 'IN_PROGRESS';
const STATUS_UNTOUCHED = 'UNTOUCHED';
const STATUS_DONE = 'DONE';
const STATUS_FAILED = 'FAILED';
const STATUS_TERMINATED = 'TERMINATED';

export class CH {

    constructor(name, action, next, error) {
        validate(name, action);
        let status = STATUS_UNTOUCHED;
        const context = new ChainContext(name);
        if (error) {
            context.set('$error', error);
        }
        putChain(name, this);
        this.terminate = () => {
            context.set('$isTerminated', true);
        };
        this.execute = (done, param) => {
            context.validate();
            status = STATUS_IN_PROGRESS;
            if ((param && param.$error) && !context.$error) {
                context.set('$error', param.$error());
            }
            if (context.$isTerminated && context.$isTerminated()) {
                status = STATUS_TERMINATED;
                done(context);
            } else {
                lodash.defer(() => {
                    try {
                        action(context, param, () => {
                            if (next) {
                                ChainStorage[next]().execute(done, context);
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
                            ChainStorage[context.$error()]().execute(done, context);
                        } else {
                            done({
                                $error: () => err
                            });
                        }
                    }
                });
            }
        };
        this.status = () => {
            return status;
        };
        this.info = () => {
            return {
                name: name,
                status: status,
                next: next,
                errorHandler: error
            }
        };
    }

    size() {
        return sizeOf(this);
    }

}

export const Execute = (name, param, done) => {
    if (!ChainStorage[name]) {
        throw new Error('Chain ' + name + ' does not exist.');
    }
    let context = new ChainContext('starter');
    if (param) {
        const keys = lodash.keys(param);
        keys.forEach(key => {
            const val = lodash.get(param, key);
            if (val instanceof Function) {
                throw new Error('Param must not contain functions');
            }
            context.set(key, val);
        });
    }
    ChainStorage[name]().execute(done, context);
};

function validate(name, action) {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
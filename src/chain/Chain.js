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
        this.spec = [];
        if (error) {
            context.set('$error', error);
        }
        putChain(name, this);
        this.terminate = () => {
            context.set('$isTerminated', true);
        };
        this.execute = (done, param) => {
            status = STATUS_IN_PROGRESS;
            if (param) {
                param.validate();
            }
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
        this.addSpec = (field, required, customValidator) => {
            const spec = new ChainSpec(field, required, customValidator);
            this.spec.push(spec);
            context.addValidator(spec);
        }
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

export class ChainSpec {
    constructor(field, required, customValidator) {
        if (customValidator && !(customValidator instanceof Function)) {
            throw new Error('customValidator must be a Function instance.');
        }
        this.field = field;
        this.required = required;
        this.validate = (context) => {
            if (required && (!context[field] || context[field]() === '')) {
                throw new Error('Field ' + field + ' is required.');
            }
            if (customValidator && context[field]) {
                customValidator(context[field](), (valid, message) => {
                    if (!valid) {
                        throw new Error(message || 'Validation failed for field ' + field);
                    }
                });
            }
        }
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
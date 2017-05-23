import { ChainStorage, putChain } from './ChainStorage';

import ChainContext from './ChainContext';
import { RunMiddleware } from './ChainMiddleware';
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
        let context = new ChainContext();
        context.addValidator(new ChainSpec('$next', true, undefined, true));
        context.addValidator(new ChainSpec('$error', false, undefined, true));
        context.addValidator(new ChainSpec('$owner', true, undefined, true));
        context.set('$owner', name);
        this.spec = [];
        putChain(name, this);
        this.terminate = () => {
            context.set('$isTerminated', true);
        };

        this.execute = (done, pr, nxt) => {
            if (error) {
                context.set('$error', error, true);
            }
            context.set('$next', nxt || next, true);
            const param = pr && pr.clone ? pr.clone() : pr;
            status = STATUS_IN_PROGRESS;
            RunMiddleware(param, (errMiddleware) => {
                if (errMiddleware) {
                    done({
                        $err: () => errMiddleware,
                        $errorMessage: () => errMiddleware && errMiddleware.message
                    });
                } else {
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
                                action(context, param, (err) => {
                                    if (err && err instanceof Error) {
                                        failed(done, context, name, err);
                                    } else {
                                        if (context.$next && context.$next()) {
                                            if (context.$isTerminated && context.$isTerminated()) {
                                                status = STATUS_TERMINATED;
                                                done(context);
                                            } else {
                                                lodash.clone(ChainStorage[next]()).execute(done, context);
                                            }
                                        } else {
                                            done(context);
                                        }
                                        status = STATUS_DONE;
                                    }
                                });
                            } catch (err) {
                                failed(done, context, name, err);
                            }
                        });
                    }
                }
            }, context.$next ? context.$next() : undefined);
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
        const failed = (done, context, name, err) => {
            status = STATUS_FAILED;
            if (context.$error) {
                context.set('$err', err);
                context.set('$errorMessage', err.message);
                context.set('$name', name);
                lodash.clone(ChainStorage[context.$error()]()).execute(done, context);
            } else {
                done({
                    $err: () => err,
                    $errorMessage: () => err ? err.message : ''
                });
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
    if (ChainStorage[name]) {
        const chain = lodash.clone(lodash.get(ChainStorage, name)());
        chain.execute(done, context, name);
    };
};

export class ChainSpec {
    constructor(field, required, customValidator, immutable) {
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
        this.immutable = immutable;
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
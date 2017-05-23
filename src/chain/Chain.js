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
        this.spec = [];
        this.terminate = () => {
            context.set('$isTerminated', true);
        };
        this.execute = (done, pr, nxt) => {
            context = CreateContext(name, next, error);
            const param = ConvertToContext(pr).clone();
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
                        const clonedContext = context.clone();
                        done(clonedContext);
                    } else {
                        lodash.defer(() => {
                            try {
                                action(context, param, err => {
                                    if (err && err instanceof Error) {
                                        failed(done, context, name, err);
                                    } else {
                                        status = STATUS_DONE;
                                        if (context.$next && context.$next()) {
                                            if (context.$isTerminated && context.$isTerminated()) {
                                                status = STATUS_TERMINATED;
                                                const clonedContext = context.clone();
                                                done(clonedContext);
                                            } else {
                                                lodash.clone(ChainStorage[context.$next()]()).execute(done, context);
                                            }
                                        } else {
                                            const clonedContext = context.clone();
                                            done(clonedContext);
                                        }
                                    }
                                });
                            } catch (err) {
                                failed(done, context, name, err);
                            }
                        });
                    }
                }
            }, nxt || next);
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
                lodash.clone(ChainStorage[context.$error()]()).execute(done, CreateErrorContext(context.$error(), name, err));
            } else {
                console.warn('UnhandledErrorCallback', err);
                done({
                    $err: () => err,
                    $errorMessage: () => err ? err.message : ''
                });
            }
        };

        putChain(name, this);
    }

    size() {
        return sizeOf(this);
    }

}

export const Execute = (name, param, done) => {
    if (!ChainStorage[name]) {
        throw new Error('Chain ' + name + ' does not exist.');
    }
    let context = ConvertToContext(param);
    context.set('$owner', name + '_starter');
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

const validate = (name, action) => {
    if (!name) {
        throw new Error('Name is required.');
    }
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}

const CreateContext = (name, next, error) => {
    const context = new ChainContext();
    context.addValidator(new ChainSpec('$next', false, undefined, true));
    context.addValidator(new ChainSpec('$error', false, undefined, true));
    context.addValidator(new ChainSpec('$owner', true, undefined, true));
    context.set('$owner', name);
    if (error) {
        context.set('$error', error);
    }
    if (next) {
        context.set('$next', next);
    }
    return context;
}



const CreateErrorContext = (name, errorFrom, err) => {
    const context = new ChainContext();
    context.addValidator(new ChainSpec('$err', true, undefined, true));
    context.addValidator(new ChainSpec('$errorMessage', true, undefined, true));
    context.addValidator(new ChainSpec('$errorFrom', true, undefined, true));
    context.addValidator(new ChainSpec('$owner', true, undefined, true));
    context.set('$owner', name);
    context.set('$err', err);
    context.set('$errorMessage', err.message);
    context.set('$errorFrom', errorFrom);
    return context;
}

const ConvertToContext = (param) => {
    if (!(param instanceof ChainContext)) {
        let context = new ChainContext();
        context.addValidator(new ChainSpec('$owner', false, undefined, true));
        if (param) {
            lodash.forIn(param, (val, key) => {
                context.addValidator(new ChainSpec(key, false, undefined, true));
                if (val instanceof Function) {
                    throw new Error('Param must not contain functions');
                }
                context.set(key, val);
            });
        }
        return context;
    }
    return param;
}
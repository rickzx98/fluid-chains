import { $CACHE, $STRICT } from './ChainSettings';
import {
    ChainStorage,
    addChainState,
    createChainState,
    getConfig,
    getState,
    putChain,
    removeState,
} from './ChainStorage';
import { ConvertToContext, CreateContext, CreateErrorContext } from './ContextFactory';
import { STATUS_DONE, STATUS_FAILED, STATUS_IN_PROGRESS, STATUS_TERMINATED, STATUS_UNTOUCHED } from './ChainStatus';

import ChainContext from './ChainContext';
import ChainSpec from './ChainSpec';
import {
    RunMiddleware,
} from './ChainMiddleware';
import { ValidateConstructor } from './Validation';
import lodash from 'lodash';
import sizeOf from 'object-sizeof';

export class CH {
    constructor(name, action, next, error) {
        ValidateConstructor(name, action);
        let context = new ChainContext();
        context.set('$owner', name);
        context.set('$$chain.status', STATUS_UNTOUCHED);
        context.set('$$chain.next', next);
        context.set('$$chain.name', name);
        context.set('$$chain.error', error);
        this.spec = [];
        this.terminate = () => {
            context.set('$isTerminated', true);
        };
        this.execute = (done, pr, nxt, belt) => {
            let cacheEnabled = !!getConfig()[$CACHE];
            context = CreateContext(context, name, belt ? nxt : next, error);
            const param = !!getConfig()[$STRICT] ? ConvertToContext(pr).cloneFor(context) : ConvertToContext(pr).clone();
            context.set('$$chain.status', STATUS_IN_PROGRESS);
            invokeChain(done, name, next, action, this.spec, context, param, nxt, belt, cacheEnabled);
        };
        this.status = () => {
            return context.$$chain.status();
        };
        this.info = () => {
            return {
                name: name,
                status: context.$$chain.status(),
                next: next,
                errorHandler: error,
                responseTime: context.$responseTime ? context.$responseTime() : 0
            }
        };
        this.addSpec = (field, required, customValidator) => {
            const spec = new ChainSpec(field, required, customValidator);
            this.spec.push(spec);
            context.addValidator(spec);
            return spec;
        };
        putChain(name, this);
    }

    size() {
        return sizeOf(this);
    }
}

const ChainResponse = (done, context, startTime) => {
    context.set('$responseTime', new Date().getTime() - startTime);
    const clonedContext = context.clone();
    if (getConfig()[$CACHE] && context.$$chain && context.$$chain.id) {
        removeState(context.$$chain.id);
    }
    done(clonedContext);
};

const failed = (done, context, name, err) => {
    context.set('$$chain.status', STATUS_FAILED);
    if (context.$error) {
        lodash.clone(ChainStorage[context.$error()]()).execute(done, CreateErrorContext(context.$error(), name, err, context.$next()));
    } else {
        console.warn('UnhandledErrorCallback', err);
        done({
            $err: () => err,
            $errorMessage: () => err ? err.message : ''
        });
    }
};

const invokeChain = (done, name, next, action, spec, context, param, nxt, belt, cacheEnabled) => {
    RunMiddleware(param, (errMiddleware) => {
        if (errMiddleware) {
            done({
                $err: () => errMiddleware,
                $errorMessage: () => errMiddleware && errMiddleware.message
            });
        } else {
            context.validate(param);
            if ((param && param.$error) && !context.$error) {
                context.set('$error', param.$error());
            }
            if (context.$isTerminated && context.$isTerminated()) {
                context.set('$$chain.status', STATUS_TERMINATED);
                const clonedContext = context.clone();
                done(clonedContext);
            } else {
                lodash.defer(() => {
                    const startTime = new Date().getTime();
                    try {
                        if (cacheEnabled && (param.$$chain && param.$$chain.id)) {
                            let key = param.$$chain.id;
                            if (getState(key, name, param)) {
                                let cachedContext = getState(key, name, param).clone();
                                concludeNextAction(cachedContext, param, belt, startTime, done);
                            } else {
                                invokeAction(action, name, spec, context, param, belt, cacheEnabled, startTime, done);
                            }
                        } else {
                            invokeAction(action, name, spec, context, param, belt, cacheEnabled, startTime, done);
                        }
                    } catch (err) {
                        context.set('$responseTime', new Date().getTime() - startTime);
                        failed(done, context, name, err);
                    }
                });
            }
        }
    }, belt ? nxt : nxt || next);
};
const invokeAction = (action, name, spec, context, param, belt, cacheEnabled, startTime, done) => {
    context.initDefaults();
    action(context, param, err => {
        if (err && err instanceof Error) {
            failed(done, context, name, err);
        } else {
            if (cacheEnabled) {
                let key;
                if (!param.$$chain || !param.$$chain.id) {
                    key = createChainState(name, spec, param, context);
                } else {
                    key = param.$$chain.id;
                    addChainState(key, name, spec, param, context);
                }
                context.set('$$chain.id', key);
            }
            concludeNextAction(context, param, belt, startTime, done);
        }
    });
};

const concludeNextAction = (context, param, belt, startTime, done) => {
    context.set('$$chain.status', STATUS_DONE);
    if (!belt && context.$next) {
        if (context.$isTerminated && context.$isTerminated()) {
            context.set('$$chain.status', STATUS_TERMINATED);
            ChainResponse(done, context, startTime);
        } else {
            context.set('$responseTime', new Date().getTime() - startTime);
            lodash.clone(ChainStorage[context.$next()]()).execute(done, context);
        }
    } else {
        ChainResponse(done, context, startTime);
    }
};

export const Action = (target, key, descriptor) => {
    let chain;
    if (target) {
        lodash.set(target, `CHAIN_${key.toUpperCase()}`, key);
    }
    if (descriptor && descriptor.value instanceof Function) {
        chain = new CH(key, descriptor.value);
    } else {
        throw new Error('Must be declared in a function with (context, paran, next).');
    }
    return chain;
};


import ChainContext from './ChainContext';
import ChainSpec from './ChainSpec';
import lodash from 'lodash';

export const CreateErrorContext = (name, errorFrom, err) => {
    const context = new ChainContext();
    context.addValidator(new ChainSpec('$err', true, undefined, true));
    context.addValidator(new ChainSpec('$errorMessage', true, undefined, true));
    context.addValidator(new ChainSpec('$errorFrom', true, undefined, true));
    context.addValidator(new ChainSpec('$owner', true, undefined, true));
    context.addValidator(new ChainSpec('$responseTime', false, undefined, true));
    context.set('$owner', name);
    context.set('$err', err);
    context.set('$errorMessage', err.message);
    context.set('$errorFrom', errorFrom);
    return context;
}

export const ConvertToContext = (param) => {
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


export const CreateContext = (original, name, next, error) => {
    original.addValidator(new ChainSpec('$next', false, undefined, true));
    original.addValidator(new ChainSpec('$error', false, undefined, true));
    original.addValidator(new ChainSpec('$owner', false, undefined, true));
    const context = original.clone();
    if (error && !context.$error) {
        context.set('$error', error);
    }
    if (next && !context.$next) {
        context.set('$next', next);
    }
    return context;
}
import { generateUUID } from './Util';
import lodash from 'lodash';

export const ChainStorage = {};

export const putChain = (name, chain) => {
    if (lodash.get(ChainStorage, name)) {
        throw Error('A chain with the same name as "' + name + '" has already been stored.')
    }
    lodash.set(ChainStorage, name, () => chain);
};

export const createChainState = (name, spec, param, context) => {
    const key = generateUUID();
    addChainState(key, name, spec, param, context);
    return key;
}
export const addChainState = (key, name, spec, param, context) => {
    const state = {};
    if (spec && spec.length) {
        const params = {};
        spec.forEach(chainSpec => {
            lodash.set(params, chainSpec.field, param[chainSpec.field]());
        });
        lodash.set(state, 'spec', spec);
        lodash.set(state, 'params', param);
        lodash.set(state, 'context', lodash.clone(context));
    }
    if (!lodash.get(ChainStorage, key)) {
        lodash.set(ChainStorage, key, {});
    }
    const chainState = lodash.get(ChainStorage, key);
    lodash.set(chainState, name, state);
}

export const removeState = (key) => {
    lodash.unset(ChainStorage, key);
}
export const getState = (key, name, param) => {
    const state = lodash.get(ChainStorage, key);
    const stateChain = lodash.get(state, name);
    let context = undefined;
    if (stateChain && stateChain.spec) {
        let valid = [];
        stateChain.spec.forEach(fieldSpec => {
            if (param[fieldSpec.field]) {
                valid.push(param[fieldSpec.field]() === stateChain.params[fieldSpec.field]());
            }
        });
        if (lodash.filter(valid, value => value).length === stateChain.spec.length) {
            context = stateChain.context;
        }
    }
    return context;
}
export const getMiddlewares = () => {
    return lodash.filter(ChainStorage, (storage) => {
        if (storage instanceof Function) {
            const chain = storage();
            return chain.type && chain.type === 'MIDDLEWARE';
        }
    });
}

export const putConfig = (name, value) => {
    lodash.set(getConfig(), name, value);
}

export const getConfig = () => {
    let config = lodash.get(ChainStorage, '$chain.$config');
    if (!config) {
        lodash.set(ChainStorage, '$chain.$config', {});
        config = lodash.get(ChainStorage, '$chain.$config');
    }
    return config;
}

export const clearStorage = () => {
    lodash.forIn(ChainStorage, (field, key) => {
        lodash.unset(ChainStorage, key);
    });
}
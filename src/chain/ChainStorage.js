import { generateUUID } from './Util';
import lodash from 'lodash';

export const ChainStorage = {};

export const putChain = (name, chain) => {
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
            if (chainSpec.required) {
                lodash.set(params, chainSpec.field, param[chainSpec.field]());
            }
        });
        lodash.set(state, 'params', param);
        lodash.set(state, 'context', { ...context });
    }
    if (!lodash.get(ChainStorage, key)) {
        lodash.set(ChainStorage, key, {});
    }
    const chainState = lodash.get(ChainStorage, key);
    lodash.set(chainState, name, )
}

export const removeState = (key) => {
    lodash.unset(ChainStorage, key);
}
export const getMiddlewares = () => {
    return lodash.filter(ChainStorage, (storage) => {
        const chain = storage();
        return chain.type && chain.type === 'MIDDLEWARE';
    });
}
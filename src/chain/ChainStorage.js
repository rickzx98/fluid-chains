import { generateUUID } from './Util';
import lodash from 'lodash';

export const ChainStorage = {};

export const putChain = (name, chain) => {
    lodash.set(ChainStorage, name, () => chain);
};

export const createChainState = (chain) => {
    const key = generateUUID();
    lodash.set(ChainStorage, key, {
        root: Chain
    });
}

export const getMiddlewares = () => {
    return lodash.filter(ChainStorage, (storage) => {
        const chain = storage();
        return chain.type && chain.type === 'MIDDLEWARE';
    });
}

class ChainState  {
    constructor(chain, name, param){
        
    }
}
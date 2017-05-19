import lodash from 'lodash';

export const ChainStorage = {};

export const putChain = (name, chain) => {
    lodash.set(ChainStorage, name, () => chain);
};


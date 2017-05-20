import lodash from 'lodash';

export const ChainStorage = {};

export const putChain = (name, chain) => {
    lodash.set(ChainStorage, name, () => chain);
};

export const getMiddlewares = () => {
    return lodash.filter(ChainStorage, (storage) => {
        const chain = storage();
        return chain.type && chain.type === 'MIDDLEWARE';
    });
}
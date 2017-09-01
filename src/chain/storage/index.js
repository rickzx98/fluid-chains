import { putChain as pc, putChainContext as pcc } from './put';

import { exists } from './exists';

export { setPutChainContextPlugin, setPutChainPlugin } from './put';


if (window) {
    window.storage = {};
}

const storage = window ? window.storage : {};

export const putChain = (name, chain) => {
    pc(storage, exists, name, chain);
}

export const putChainContext = (chainId, field, value) => {
    pcc(storage, chainId, field, value);
}
import {
    getChain as gc,
    getChainContext as gcc,
    getChainDataById as gcdbi,
    setGetChainPlugin as sgc,
    setGetChainContextPlugin as sgcc
} from './get';
import {
    putChain as pc,
    putChainContext as pcc,
    setPutChainPlugin as setPC,
    setPutChainContextPlugin as setPCC
} from './put';

import { exists } from './exists';
import {generateUUID} from '../Util';
if (global && !global.storage) {
    global.storage = {};
}

const storage = global.storage;

export function getChain(name) {
    return gc(storage, name);
}
export function getChainContext(chainId, field) {
    return gcc(storage, chainId, field);
}
export function putChain(name, chain) {
    pc(storage, exists, name, chain);
}

export function putChainContext(chainId, field, value) {
    pcc(storage, chainId, field, value);
}

export function getChainDataById(chainId) {
    return gcdbi(storage, chainId);
}

export function createExecutionStack() {
    const stackId = generateUUID();
    storage[stackId] = {
        type: 'execution',
        chains: []
    };
    return stackId;
}

export function addChainToStack(stackId, chainId) {
    storage[stackId].chains.push(chainId);
}

export function deleteStack(stackId) {
    const stack = storage[stackId];
    stack.chains.forEach(chainId=> {
        const chain = storage[chainId];
        for (let field in chain) {
            if (chain.hasOwnProperty(field)) {
                delete chain[field];
            }
        }
        delete storage[chainId];
    });
    delete storage[stackId];
}


export function getStorage() {
    return Object.freeze(storage);
}
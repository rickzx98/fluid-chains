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

export function setPutChainPlugin(plugin) {
    setPC(storage, plugin);
}
export function setPutChainContextPlugin(plugin) {
    setPCC(storage, plugin);
}
export function setGetChainContextPlugin(plugin) {
    sgcc(storage, plugin);
}
export function setGetChainPlugin(plugin) {
    sgc(storage, plugin);
}

export function getChainDataById(chainId) {
    return gcdbi(storage, chainId);
}
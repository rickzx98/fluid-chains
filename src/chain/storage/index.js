import { putChain as pc,
    putChainContext as pcc,
    setPutChainContextPlugin as setPCC,
    setPutChainPlugin as setPC } from './put';
import {getChain as gc,
    getChainContext as gcc,
    setGetChainContextPlugin as sgcc,
    setGetChainPlugin as sgc} from './get';
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
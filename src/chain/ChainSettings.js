import { putConfig } from './ChainStorage';

export const ChainCacheEnabled = () => {
    putConfig('$cache', true);
}

export const ChainStrictModeEnabled = () => {
    putConfig('$strict', true);
}
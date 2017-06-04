import { getConfig, putConfig } from './ChainStorage';

export const $CACHE = '$cache';
export const $STRICT = '$strict';
export const CacheEnabled = () => {
    if (!getConfig()['$strict']) {
        throw new Error('ChainCacheEnabled Failed: Strict mode must be enabled.');
    }
    putConfig($CACHE, true);
}

export const StrictModeEnabled = () => {
    putConfig($STRICT, true);
}
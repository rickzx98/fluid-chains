import { getConfig, putConfig } from './ChainStorage';

export const CacheEnabled = () => {
    if (!getConfig()['$strict']) {
        throw new Error('ChainCacheEnabled Failed: Strict mode must be enabled.');
    }
    putConfig('$cache', true);
}

export const StrictModeEnabled = () => {
    putConfig('$strict', true);
}
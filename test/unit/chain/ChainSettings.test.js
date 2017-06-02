import 'babel-polyfill';

import { CacheEnabled, StrictModeEnabled } from '../../../src/chain/ChainSettings';

import { expect } from 'chai';
import { getConfig } from '../../../src/chain/ChainStorage';

describe('Chain Settings spec', () => {
    it('should not enable cache when strinct mode is disabled', () => {
        expect(() => {
            CacheEnabled();
        }).to.throw('ChainCacheEnabled Failed: Strict mode must be enabled.');
    });
    it('should enable strict mode', () => {
        StrictModeEnabled();
        expect(getConfig()['$strict']).to.be.true;
    });
     it('should enable cache mode', () => {
        StrictModeEnabled();
        CacheEnabled();
        expect(getConfig()['$cache']).to.be.true;
    });
});
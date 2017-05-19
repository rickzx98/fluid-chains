import 'babel-polyfill';
import { ChainStorage, putChain } from '../../../src/chain/ChainStorage';

import assert from 'assert';

describe('ChainStorage Unit', () => {
    describe('putChain', () => {
        it('should add chain to ChainStorage', () => {
            putChain('sample', 1);
            assert(ChainStorage.sample() === 1);
        });
    });
});
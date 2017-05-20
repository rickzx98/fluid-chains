import 'babel-polyfill';

import { ChainStorage, getMiddlewares, putChain } from '../../../src/chain/ChainStorage';

import { ChaimMiddleware } from '../../../src/';
import assert from 'assert';

describe('ChainStorage Unit', () => {
    describe('putChain', () => {
        it('should add chain to ChainStorage', () => {
            putChain('sample', 1);
            assert(ChainStorage.sample() === 1);
        });
    });
    it('should get all middlewares', () => {
        new ChaimMiddleware('middleWareOne', (param, next) => { });
        new ChaimMiddleware('middleWareTwo', (param, next) => { });
        new ChaimMiddleware('middleWareThree', (param, next) => { });
        const middlewares = getMiddlewares();
        assert(middlewares.length > 0);
    });
});
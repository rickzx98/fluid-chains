import 'babel-polyfill';

import { ChainStorage, getMiddlewares, putChain } from '../../../src/chain/ChainStorage';

import { ChainMiddleware } from '../../../src/';
import assert from 'assert';

describe('ChainStorage Unit', () => {
    describe('putChain', () => {
        it('should add chain to ChainStorage', () => {
            putChain('sample', 1);
            assert(ChainStorage.sample() === 1);
        });
    });
    describe('Chain state', () => {
      
    });
    it('should get all middlewares', () => {
        new ChainMiddleware('middleWareOne', (param, next) => { });
        new ChainMiddleware('middleWareTwo', (param, next) => { });
        new ChainMiddleware('middleWareThree', (param, next) => { });
        const middlewares = getMiddlewares();
        assert(middlewares.length > 0);
    });
});
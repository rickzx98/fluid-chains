import 'babel-polyfill';

import { ChainStorage, addChainState, createChainState, exists, getChains, getConfig, getMiddlewares, getState, info, putChain, putConfig, removeState } from '../../../src/chain/ChainStorage';

import { Chain } from '../../../src/';
import ChainContext from '../../../src/chain/ChainContext';
import { ChainMiddleware } from '../../../src/';
import ChainSpec from '../../../src/chain/ChainSpec';
import assert from 'assert';
import { expect } from 'chai';

describe('ChainStorage Unit', () => {
    describe('putChain', () => {
        it('should add chain to ChainStorage', () => {
            putChain('sample', 1);
            assert(ChainStorage.sample() === 1);
        });
    });
    describe('Chain state', () => {
        it('should return UIID key when create chain state', () => {
            const param = new ChainContext();
            param.set('field1', 'sample field 1');
            param.set('field2', 'sample field 2');
            const context = new ChainContext();
            context.set('field12', 'sample field12');
            const key = createChainState('samples', [
                new ChainSpec('field1', true),
                new ChainSpec('field2', true)
            ], param, context);
            expect(key).to.be.not.undefined;
        });
        it('should return context of a saved chain state', () => {
            const param = new ChainContext();
            param.set('field1', 'sample field 1');
            param.set('field2', 'sample field 2');
            const context = new ChainContext();
            context.set('field12', 'sample field12');
            const key = createChainState('samples2', [
                new ChainSpec('field1', true),
                new ChainSpec('field2', true)
            ], param, context);
            const cacheContext = getState(key, 'samples2', param);
            expect(key).to.be.not.undefined;
            expect(cacheContext.field12).to.be.not.undefined;
            expect(cacheContext.field12()).to.be.equal('sample field12');
        });
        it('should return context of a saved chain state with no spec', () => {
            const param = new ChainContext();
            param.set('field1', 'sample field 1');
            param.set('field2', 'sample field 2');
            const context = new ChainContext();
            context.set('field12', 'sample field12');
            const key = createChainState('samples2', [], param, context);
            const cacheContext = getState(key, 'samples2', param);
            expect(key).to.be.not.undefined;
            expect(cacheContext.field12).to.be.not.undefined;
            expect(cacheContext.field12()).to.be.equal('sample field12');
        });
        it('should not return context of an unequal parameter value', () => {
            const param = new ChainContext();
            param.set('field1', 'sample field 1');
            param.set('field2', 'sample field 2');
            const context = new ChainContext();
            context.set('field12', 'sample field12');
            const key = createChainState('samples3', [
                new ChainSpec('field1', true),
                new ChainSpec('field2', true)
            ], param, context);
            const unequalParam = new ChainContext();
            unequalParam.set('field1', 'field1');
            unequalParam.set('field2', 'sample field 2');
            const cacheContext = getState(key, 'samples3', unequalParam);

            expect(key).to.be.not.undefined;
            expect(cacheContext).to.be.undefined;
        });
        it('should remove the state', () => {
            const param = new ChainContext();
            param.set('field1', 'sample field 1');
            param.set('field2', 'sample field 2');
            const context = new ChainContext();
            context.set('field12', 'sample field12');
            const key = createChainState('samples4', [
                new ChainSpec('field1', true),
                new ChainSpec('field2', true)
            ], param, context);
            const cacheContext = getState(key, 'samples4', param);

            expect(key).to.be.not.undefined;
            expect(cacheContext).to.be.not.undefined;
            removeState(key);

            const clearedContext = getState(key, 'samples4', param);
            expect(clearedContext).to.be.undefined;

        })
    });
    describe('chain config', () => {
        it('should put $chain.$config', () => {
            putConfig('cache', true);
            const config = getConfig();
            expect(config).to.be.not.undefined;
            expect(config.cache).to.be.not.undefined;
            expect(config.cache).to.be.equal(true);
        })
    });
    it('should get all middlewares', () => {
        new ChainMiddleware('middleWareOne', (param, next) => {
        });
        new ChainMiddleware('middleWareTwo', (param, next) => {
        });
        new ChainMiddleware('middleWareThree', (param, next) => {
        });
        const middlewares = getMiddlewares();
        assert(middlewares.length > 0);
    });
    it('should get all chains', () => {
        new Chain('chainStorageOne', (context, param, next) => {
        });
        new Chain('chainStorageTwo', (context, param, next) => {
        });
        new Chain('chainStorageThree', (context, param, next) => {
        });
        const chains = getChains();
        expect(chains).to.be.not.undefined;
        expect(chains.length).to.be.equal(3);
    });
    it('should check if chain exists', () => {
        putChain('sample10', 1);
        expect(exists('sample10')).to.be.true;
    });
});
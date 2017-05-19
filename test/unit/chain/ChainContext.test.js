import 'babel-polyfill';
import ChainContext from '../../../src/chain/ChainContext';
import chai from 'chai';
const expect = chai.expect;
import assert from 'assert';

describe('ChainContext Unit', () => {
    describe('constructor', () => {
        it('should have owner', () => {
            const context = new ChainContext('sample');
            assert(context.owner() === 'sample');
        });
        it('should throw error if owner is not specified', () => {
            expect(ChainContext).to.throw();
        });
    });

    describe('set', () => {
        it('should return value as function', ()=> {
            const context = new ChainContext('sample');
            context.set('hello', 'hi');
            assert(context.hello instanceof Function);
        });
        it('should set value', ()=> {
            const context = new ChainContext('sample');
            context.set('hello', 'hi');
            assert(context.hello() === 'hi');
        });
    });
});
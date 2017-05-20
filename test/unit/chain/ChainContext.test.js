import 'babel-polyfill';

import ChainContext from '../../../src/chain/ChainContext';
import assert from 'assert';
import chai from 'chai';

const expect = chai.expect;


describe('ChainContext Unit', () => {
    describe('constructor', () => {
        it('should have $owner', () => {
            const context = new ChainContext('sample');
            assert(context.$owner() === 'sample');
        });
        it('should throw error if $owner is not specified', () => {
            expect(ChainContext).to.throw();
        });
    });

    describe('set', () => {
        it('should return value as function', () => {
            const context = new ChainContext('sample');
            context.set('hello', 'hi');
            assert(context.hello instanceof Function);
        });
        it('should set value', () => {
            const context = new ChainContext('sample');
            context.set('hello', 'hi');
            assert(context.hello() === 'hi');
        });
        it('should not be mutated', () => {
            const context = new ChainContext('sample');
            context.set('hello', { remark: 'hi' });
            context.hello().remark = 'hello';
            assert(context.hello().remark === 'hi');
        });
        it('should throw an error if a Function is set to value', () => {
            const context = new ChainContext('sample');
            expect(() => {
                context.set('tryFunction', () => { });
            }).to.throws();
        });
    });
});
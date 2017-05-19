import 'babel-polyfill';
import Chain from '../../../src/chain/Chain';
import {ChainStorage} from '../../../src/chain/ChainStorage';
import chai from 'chai';
const expect = chai.expect;

describe('Chain Unit', () => {
    describe('constructor', () => {
        it('should throw an error when Action is undefined', () => {
            expect(Chain).to.throw();
        });
        it('should create a new context with its name as the owner()', () => {
            const chain = new Chain('sample', ()=> {
            });
            expect(chain.context.owner()).to.equal('sample');
        });
        it('should put in ChainStorage', () => {
            const chain = new Chain('sample', ()=> {
            });
            expect(ChainStorage.sample).to.be.defined;
        });
    });
});
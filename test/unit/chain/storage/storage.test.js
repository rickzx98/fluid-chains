import 'babel-polyfill';
import { expect } from 'chai';
import {putChain,
    putChainContext,
    setPutChainContextPlugin,
    setPutChainPlugin,
    getChain,
    getChainContext,
    setGetChainContextPlugin,
    setGetChainPlugin} from '../../../../src/chain/storage/';

describe('storage.unit.test', ()=> {
    it('should put and get chain in storage', ()=> {
        putChain('storageTest.chain000', {
            execute: ()=> {
            }
        });
        const chain = getChain('storageTest.chain000');
        expect(chain).to.be.not.undefined;
        expect(chain.$chainId).to.be.not.undefined;
    });

    it('should put and get chain context in storage', () => {
        putChain('storageTest.chain001', {});
        const chain = getChain('storageTest.chain001');
        const chainId = chain.$chainId;
        putChainContext(chainId, 'sampleField', 'sampleValue');
        const context = getChainContext(chainId, 'sampleField');
        expect(context).to.not.undefined;
        expect(context()).to.be.equal('sampleValue');
    });

});
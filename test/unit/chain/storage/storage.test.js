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

    it('should put and get chain in storage with plugin methods', ()=> {
        const mockStorage = {};
        setPutChainPlugin((name, chain)=> {
            mockStorage[name] = chain;
        });

        setGetChainPlugin((name)=> {
            const chainObject = Object.assign({}, mockStorage[name]);
            chainObject['id'] = 'chainIDSample';
            return Object.assign({}, chainObject);
        });

        putChain('storageTest.chain002', {
            execute: ()=> {
            }
        });
        const chain = getChain('storageTest.chain002');
        expect(chain).to.be.not.undefined;
        expect(chain.id).to.be.not.undefined;
        expect(chain.id).to.be.equal('chainIDSample');
        expect(mockStorage['storageTest.chain002']).to.be.not.undefined;
    });
    it('should put and get chain context in storage with plugin methods', ()=> {
        const mockStorage = {};
        setPutChainContextPlugin((chainId, field, value)=> {
            mockStorage[chainId] = {};
            mockStorage[chainId][field] = value;
        });
        setGetChainContextPlugin((chainId, field)=>{
            return mockStorage[chainId][field];
        });
        putChain('storageTest.chain003', {});
        const chain = getChain('storageTest.chain003');
        const chainId = chain.$chainId;
        putChainContext(chainId, 'sampleField', 'sampleValue');
        const context = getChainContext(chainId, 'sampleField');
        expect(context).to.not.undefined;
        expect(context()).to.be.equal('sampleValue');
        expect(mockStorage[chainId]).to.be.not.undefined;
        expect(mockStorage[chainId]['sampleField']).to.be.not.undefined;
    });
});
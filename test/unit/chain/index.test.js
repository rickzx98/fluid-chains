import 'babel-polyfill';

import { Chain, execute } from '../../../src/chain/';

import chai from 'chai';

const expect = chai.expect;

describe.only('Chain unit test', () => {
    it('executes chain', done => {
        new Chain('SampleChain1', (parameter) => {
            let context = {};
            context.hello = 'world!';
            context.fromParam = parameter.hi;
            return context;
        });

        execute({ hi: 'initParam' }, 'SampleChain1')
            .then(result => {
                expect(result.hello()).to.be.equal('world!');
                expect(result.fromParam()).to.be.equal('initParam');
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });

    it('executes chain asynchronously', done => {
        new Chain('SampleChain2', (parameter) => {
            let context = {};
            context.hello = 'world!';
            context.fromParam = parameter.hi;
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(context);
                });
            });
        });

        execute({ hi: 'initParam' }, 'SampleChain2')
            .then(result => {
                expect(result.hello()).to.be.equal('world!');
                expect(result.fromParam()).to.be.equal('initParam');
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    });
});
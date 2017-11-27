import 'babel-polyfill';

import { Chain } from '../../../src/chain/';
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

        Chain.start('SampleChain1', { hi: 'initParam' })
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

        Chain.start('SampleChain2', { hi: 'initParam' })
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

    it('executes chain that return string literals', done => {
        new Chain('SampleChain3', (parameter) => {
            return 'hello';
        });
        Chain.start('SampleChain3')
            .then(result => {
                expect(result.value).to.be.not.undefined;
                expect(result.value()).to.be.equal('hello');
                done();
            });
    });

    it('executes multiple chains', done => {
        new Chain('SampleChain4', (parameter) => {
            return {
                _1st: '1st'
            };
        });
        new Chain('SampleChain5', (parameter) => {
            return parameter._1st() + ' - 2nd';
        });
        new Chain('SampleChain6', (parameter) => {
            return {
                _3rd: parameter.value() + ' - 3rd'
            };
        });

        Chain.start(['SampleChain4', 'SampleChain5', 'SampleChain6'])
            .then(result => {
                expect(result._3rd()).to.be.equal('1st - 2nd - 3rd');
                done();
            }).catch(err => {
                done();
            });
    });

    it('executes chain with reducer', done => {
        done();
    })
});
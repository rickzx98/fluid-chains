import 'babel-polyfill';

import { Chain } from '../../../src/chain/';
import chai from 'chai';

const expect = chai.expect;

describe('Chain unit test', () => {
    it('executes chain', done => {
        new Chain('SampleChain1', (parameter) => {
            let context = {};
            context.hello = 'world!';
            context.fromParam = parameter.hi();
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
            context.fromParam = parameter.hi();
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
            }).catch(() => {
                done();
            });
    });

    it('executes chain with reducer', done => {
        new Chain('SampleChainReducer', (parameter, current) => {
            return current + (parameter.value ? parameter.value() : 0);
        }).reduce('sampleArray');

        Chain.start('SampleChainReducer', { sampleArray: [1, 2, 3, 4, 5] })
            .then(result => {
                expect(result.value()).to.be.equal(15);
                done();
            })
            .catch(err => console.log);
    });

    it('executes multiple chains with reducer', done => {
        new Chain('SampleChainReducer1', (parameter, current) => {
            return current + (parameter.value ? parameter.value() : 0);
        }).reduce('sampleArray');
        new Chain('SampleChain7', (parameter) => {
            return { sum: 5 + parameter.value() };
        });
        Chain.start(['SampleChainReducer1', 'SampleChain7'], { sampleArray: [1, 2, 3, 4, 5] })
            .then(result => {
                expect(result.sum()).to.be.equal(20);
                done();
            })
            .catch(err => console.log);
    });

    it('should executes chain with strict mode on', done => {
        new Chain('SampleChain8', (parameter) => {
            expect(parameter.sample).to.be.not.undefined;
            expect(parameter.hello).to.be.undefined;
        }).spec('sample', {
            require: true
        }).strict();
        Chain.start('SampleChain8', {
            sample: 'sample',
            hello: 'hello'
        }).then(() => {
            done();
        });
    });
});
import 'babel-polyfill';

import { CM as ChainMiddleware, RunMiddleware } from '../../../src/chain/ChainMiddleware';

import chai from 'chai';

const expect = chai.expect;
describe('ChaimMiddleware Unit', () => {
    describe('constructor', () => {
        it('should throw an error when name and actions undefined', () => {
            expect(() => {
                new ChainMiddleware();
            }).to.throw();
        });
        it('should return type MIDDLEWARE', () => {
            const middleware = new ChainMiddleware('hello', () => { });
            expect(middleware.type).to.be.equal('MIDDLEWARE');
        });
    });
    describe('RunMiddleware', () => {
        it('should run middlewares', (done) => {
            let index = 0;
            new ChainMiddleware('hello', (param, nextChain, next) => {
                index++;
                expect(nextChain).to.be.equal('nextChainName');
                next();
            });
            new ChainMiddleware('hi', (param, nextChain, next) => {
                index++;
                expect(nextChain).to.be.equal('nextChainName');
                next();
            });
            RunMiddleware({
                sample: () => 'hello'
            }, () => {
                expect(index).to.be.equal(2);
                done();
            }, 'nextChainName');
        });
        it('should break when one middleware fails', (done) => {
            let index = 0;
            new ChainMiddleware('hello', (param, nextChain, next) => {
                index++;
                expect(nextChain).to.be.equal('nextSample');
                next();
            });
            new ChainMiddleware('hi', (param, nextChain, next) => {
                index++;
                throw new Error('Hi');
            });
            new ChainMiddleware('bye', (param, nextChain, next) => {
                index++;
                next();
            });
            RunMiddleware({
                sample: () => 'hello'
            }, (err) => {
                expect(err).to.be.defined;
                expect(index).to.be.equal(2);
                done();
            }, 'nextSample');
        });
        it('should share the same parameter', (done) => {
            let index = 0;
            new ChainMiddleware('hello', (param, nextChain, next) => {
                if (param.sample() === 'hello') {
                    index++;
                }
                next();
            });
            new ChainMiddleware('hi', (param, nextChain, next) => {
                if (param.sample() === 'hello') {
                    index++;
                }
                next();
            });
            new ChainMiddleware('bye', (param, next) => {
                if (param.sample() === 'hello') {
                    index++;
                }
                next();
            });
            RunMiddleware({
                sample: () => 'hello'
            }, (err) => {
                expect(index).to.be.equal(3);
                done();
            });
        });
    })
});
import 'babel-polyfill';

import { CM as ChainMiddleware, RunMiddleware } from '../../../src/chain/ChainMiddleware';
import { clearStorage, getMiddlewares } from '../../../src/chain/ChainStorage';

import chai from 'chai';

const expect = chai.expect;
describe('ChaimMiddleware Unit', () => {
    describe('constructor', () => {
        before(() => {
            clearStorage();
        });
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
            clearStorage();
            let index = 0;
            new ChainMiddleware('helloM0', (param, nextChain, next) => {
                index++;
                expect(nextChain).to.be.equal('nextChainName');
                next();
            });
            new ChainMiddleware('hiM0', (param, nextChain, next) => {
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
            clearStorage();
            let index = 0;
            new ChainMiddleware('hello1', (param, nextChain, next) => {
                index++;
                console.log('hello1', index);
                expect(nextChain).to.be.equal('nextSample');
                next();
            });
            new ChainMiddleware('hiM1', (param, nextChain, next) => {
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
                expect(2).to.be.equal(index);
                done();
            }, 'nextSample');
        });
        it('should share the same parameter', (done) => {
            clearStorage();
            let index = 0;
            new ChainMiddleware('helloM2', (param, nextChain, next) => {
                if (param.sample() === 'hello') {
                    index++;
                }
                next();
            });
            new ChainMiddleware('hiM2', (param, nextChain, next) => {
                if (param.sample() === 'hello') {
                    index++;
                }
                next();
            });
            new ChainMiddleware('byeM', (param, next) => {
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
import 'babel-polyfill';

import { CH as ChainMiddleware, RunMiddleware } from '../../../src/chain/ChainMiddleware';

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
            new ChainMiddleware('hello', (param, next) => {
                index++;
                next();
            });
            new ChainMiddleware('hi', (param, next) => {
                index++;
                next();
            });
            RunMiddleware({
                sample: () => 'hello'
            }, () => {
                expect(index).to.be.equal(2);
                done();
            });
        });
        it('should break when one middleware fails', (done) => {
            let index = 0;
            new ChainMiddleware('hello', (param, next) => {
                index++;
                next();
            });
            new ChainMiddleware('hi', (param, next) => {
                index++;
                throw new Error('Hi');
            });
            new ChainMiddleware('bye', (param, next) => {
                index++;
                next();
            });
            RunMiddleware({
                sample: () => 'hello'
            }, (err) => {
                expect(err).to.be.defined;
                expect(index).to.be.equal(2);
                done();
            });
        });
        it('should share the same parameter', (done) => {
            let index = 0;
            new ChainMiddleware('hello', (param, next) => {
                if (param.sample() === 'hello') {
                    index++;
                }
                next();
            });
            new ChainMiddleware('hi', (param, next) => {
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
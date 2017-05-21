import 'babel-polyfill';

import { Chain, ExecuteChain } from '../../../src/';

import { ChainStorage } from '../../../src/chain/ChainStorage';
import chai from 'chai';

const expect = chai.expect;

describe('Chain Unit', () => {
    describe('spec', () => {
        it('should add spec', () => {
            const chain = new Chain('hello', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            chain.addSpec('sample', true, () => { });
            expect(chain.spec).to.be.defined;
            expect(chain.spec.length).to.be.defined;
            expect(chain.spec[0].field).to.be.equal('sample');
        });
    });
    describe('execute', () => {
        it('should execute a specific chain', (done) => {
            new Chain('hello', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            ExecuteChain('hello', {}, (context) => {
                expect(context.$owner()).to.be.equal('hello');
                expect(context.saidHello).to.be.defined;
                done();
            });
        });
        it('should get the param value as ChainContext', (done) => {
            new Chain('hello', (context, param, next) => {
                context.set('saidHello', true);
                expect(param.hey).to.be.defined;
                expect(param.hey()).to.be.equal('daydreamer');
                next();
            });
            ExecuteChain('hello', { hey: 'daydreamer' }, (context) => {
                expect(context.$owner()).to.be.equal('hello');
                expect(context.saidHello).to.be.defined;
                done();
            });
        });
        it('should throw an error if param contains functions', () => {
            new Chain('hello', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            expect(() => {
                ExecuteChain('hello', { hi: () => { } }, (context) => {
                });
            }).to.throw(Error);

        });
    })
    describe('constructor', () => {
        it('should compute its size', () => {
            const chain = new Chain('sample', () => {
            }, 'nextChain', 'errorHandler');
            console.log('chain', chain.size() + ' bytes');
        });
        it('should throw an error when Action is undefined', () => {
            expect(Chain).to.throw(Error);
        });
        it('should return UNTOUCHED as the initial status', () => {
            const chain = new Chain('sample', () => {
            });
            const info = chain.info();
            expect(info.status).to.be.equal('UNTOUCHED');
        });
        it('should able to return name, next chain, errorHandler and initial status with info()', () => {
            const chain = new Chain('sample', () => {
            }, 'nextChain', 'errorHandler');
            const info = chain.info();
            expect(info.name).to.be.equal('sample');
            expect(info.status).to.be.equal('UNTOUCHED');
            expect(info.next).to.be.equal('nextChain');
            expect(info.errorHandler).to.be.equal('errorHandler');
        });
        it('should create a new context with its name as the owner()', (done) => {
            const chain = new Chain('sample', (context, param, next) => {
                expect(context.owner()).to.equal('sample');
                next();
            });
            chain.execute(() => {
                done();
            });
        });
        it('should change the status to "DONE" once the process has finished', (done) => {
            const chain = new Chain('sample', (context, param, next) => {
                expect(context.owner()).to.equal('sample');
                next();
            });
            chain.execute(() => {
                expect(chain.status() === 'DONE');
                done();
            });
        });
        it('should put in ChainStorage', () => {
            const chain = new Chain('sample', () => {
            });
            expect(ChainStorage.sample).to.be.defined;
        });
    });

    describe('action', () => {
        describe('with a single chain', () => {
            it('should execute action', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                });

                start.execute((result) => {
                    expect(result.wasHere()).to.be.true;
                    done();
                });
            });
            it('should change the status to "IN_PROGRESS" in an ongoing process', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    if (param && param.count && param.count() === 2) {
                        start.terminate();
                    } else {
                        context.set('count', param && param.count ? param.count() + 1 : 0);
                    }
                    next();
                }, 'start');

                start.execute((result) => {
                    expect(start.status()).to.be.equal('TERMINATED');
                    expect(result.count()).to.be.equal(2);
                    done();
                });

                expect(start.status()).to.be.equal('IN_PROGRESS');
            });
            it('should change the status to "FAILED" if an error has been thrown', (done) => {
                const start = new Chain('start', () => {
                    throw new Error('sample');
                });

                start.execute((result) => {
                    expect(result.$error).to.be.defined;
                    expect(start.status()).to.be.equal('FAILED');
                    done();
                });


            });
            it('should terminate its own action', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    if (param && param.count && param.count() === 5) {
                        start.terminate();
                    } else {
                        context.set('count', param && param.count ? param.count() + 1 : 0);
                    }
                    next();
                }, 'start');

                start.execute((result) => {
                    expect(start.status()).to.be.equal('TERMINATED');
                    expect(result.count()).to.be.equal(5);
                    done();
                });
            });
        });

        describe('with multiple chains', () => {
            it('should return the last chain context as the "result" of execution callback', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second').execute((result) => {
                    expect(result.wasHere).to.not.be.defined;
                    expect(result.wasHereSecond).to.be.defined;
                    done();
                });

                new Chain('second', (context, param, next) => {
                    context.set('wasHereSecond', true);
                    expect(param.wasHere).to.be.defined;
                    next()
                });
            });
            it('should execute the next chain specified on the third argument of the constructor', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second').execute((result) => {
                    expect(result.wasHereSecond).to.be.defined;
                    done();
                });

                new Chain('second', (context, param, next) => {
                    context.set('wasHereSecond', true);
                    expect(param.wasHere).to.be.defined;
                    next()
                });
            });
            it('should get the previous chain context as param to the next chain', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second').execute((result) => {
                    done();
                });

                new Chain('second', (context, param, next) => {
                    expect(param.wasHere).to.be.defined;
                    next()
                });
            });

            it('should trigger the errorHandler chain specified on the fourth argument of the constructor', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    throw new Error('sample error');
                }, 'second', 'errorHandler')
                    .execute((result) => {
                        expect(result.$error).to.be.defined;
                        expect(result.errorWasTriggered).to.be.defined;
                        done();
                    });

                new Chain('errorHandler', (context, param, next) => {
                    context.set('errorWasTriggered', true);
                    const name = param.$name();
                    expect(name).to.be.equal('start');
                    next()
                });

            });

            it('should trigger the nearest errorHandler of the chain hierarchy', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    throw new Error('sample error');
                }, 'second', 'errorHandler')
                    .execute((result) => {
                        expect(result.$error).to.be.defined;
                        expect(result.errorHandlerForStep2WasTriggered).to.be.defined;
                        expect(result.errorWasTriggered).to.not.be.defined;
                        done();
                    });

                new Chain('second', (context, param, next) => {
                    next();
                }, 'third', 'errorHandlerForStep2');

                new Chain('third', (context, param, next) => {
                    throw new Error('sample error');
                }, 'second');


                new Chain('errorHandler', (context, param, next) => {
                    context.set('errorWasTriggered', true);
                    next()
                });

                new Chain('errorHandlerForStep2', (context, param, next) => {
                    context.set('errorHandlerForStep2WasTriggered', true);
                    const name = param.$name();
                    expect(name).to.be.equal('third');
                    next()
                });

            });
        });
    });
});
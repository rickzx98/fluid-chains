import 'babel-polyfill';

import { Chain, ExecuteChain } from '../../../src/';

import { ChainStorage } from '../../../src/chain/ChainStorage';
import chai from 'chai';
import sizeOf from 'object-sizeof';

const expect = chai.expect;

describe('Chain Unit', () => {
    describe('spec', () => {
        it('should add spec', () => {
            const chain = new Chain('helloN', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            chain.addSpec('sample', true, () => { });
            expect(chain.spec).to.be.not.undefined;
            expect(chain.spec.length).to.be.not.undefined;
            expect(chain.spec[0].field).to.be.equal('sample');
        });
    });
    describe('execute', () => {
        it('should execute a specific chain', (done) => {
            const hello0 = new Chain('hello0', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            ExecuteChain('hello0', {}, (context) => {
                expect(context.$owner()).to.be.equal('hello0');
                expect(context.saidHello).to.be.not.undefined;
                console.log('hello0', hello0.info());
                done();
            });
        });
        it('should get the param value as ChainContext', (done) => {
            new Chain('hello2', (context, param, next) => {
                context.set('saidHello', true);
                expect(param.hey).to.be.not.undefined;
                expect(param.hey()).to.be.equal('daydreamer');
                next();
            });
            ExecuteChain('hello2', { hey: 'daydreamer' }, (context) => {
                expect(context.$owner()).to.be.equal('hello2');
                expect(context.saidHello).to.be.not.undefined;
                done();
            });
        });
        it('should execute chain in sequence', (done) => {
            new Chain('hello_seq_0', (context, param, next) => {
                context.set('hello_seq_0', true);
                next();
            }, 'hello_seq_1');
            new Chain('hello_seq_1', (context, param, next) => {
                context.set('hello_seq_1', true);
                next();
            });
            ExecuteChain('hello_seq_0', {}, (context) => {
                expect(context.hello_seq_1).to.be.not.undefined;
                done();
            });
        });
        it('should execute non predefined next chain in sequence', (done) => {
            new Chain('hello_seq_0_0', (context, param, next) => {
                context.set('hello_seq_0', true);
                next();
            }, 'hello_seq_0_1_trial');

            new Chain('hello_seq_0_1_trial', (context, param, next) => {
                context.set('hello_seq_1_trial', true);
                next();
            });

            new Chain('hello_seq_0_1', (context, param, next) => {
                context.set('hello_seq_1', true);
                next();
            }, 'hello_seq_0_1_trial');

            ExecuteChain(['hello_seq_0_0', 'hello_seq_0_1'], {}, (context) => {
                expect(context.hello_seq_1_trial).to.be.undefined;
                expect(context.hello_seq_1).to.be.not.undefined;
                done();
            });
        });
        it('should throw an error if param contains functions', () => {
            new Chain('hello3', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            expect(() => {
                ExecuteChain('hello3', { hi: () => { } }, (context) => {
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
                expect(context.$owner()).to.equal('sample');
                next();
            });
            chain.execute(() => {
                done();
            });
        });
        it('should change the status to "DONE" once the process has finished', (done) => {
            const chain = new Chain('sample', (context, param, next) => {
                expect(context.$owner()).to.equal('sample');
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
            expect(ChainStorage.sample).to.be.not.undefined;
        });
    });
    describe('action', () => {
        describe('with a single chain', () => {
            it('should execute action', (done) => {
                const start = new Chain('start_single', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                });

                start.execute((result) => {
                    expect(result.wasHere()).to.be.true;
                    done();
                });
            });
            it('should change the status to "IN_PROGRESS" in an ongoing process', (done) => {
                const start = new Chain('start_IN_PROGRESS', (context, param, next) => {
                    context.set('count', 1);
                    start.terminate();
                    next();
                }, 'start_IN_PROGRESS_TER');

                const end = new Chain('start_IN_PROGRESS_TER', (context, param, next) => {
                    context.set('count', param.count() + 1);
                    next();
                });

                start.execute((result) => {
                    expect(result.count()).to.be.equal(1);
                    expect(start.status()).to.be.equal('TERMINATED');
                    done();
                });

                expect(start.status()).to.be.equal('IN_PROGRESS');
            });
            it('should change the status to "FAILED" if an error has been thrown', (done) => {
                const start = new Chain('start_FAILED', () => {
                    throw new Error('sample');
                });

                start.execute((result) => {
                    expect(result.$err).to.be.not.undefined;
                    expect(start.status()).to.be.equal('FAILED');
                    done();
                });


            });
            it('should terminate its own action', (done) => {
                const start = new Chain('start_TERMINATE', (context, param, next) => {
                    start.terminate();
                    context.set('count', 1);
                    next();
                }, 'start_TERMINATE_END');

                const end = new Chain('start_TERMINATE_END', (context, param, next) => {
                    context.set('count', param.count() + 1);
                    next();
                });

                start.execute((result) => {
                    expect(result.count()).to.be.equal(1);
                    expect(start.status()).to.be.equal('TERMINATED');
                    done();
                });
            });
        });

        describe('with multiple chains', () => {
            it('should return the last chain context as the "result" of execution callback', (done) => {
                const start = new Chain('start_multiple', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second').execute((result) => {
                    expect(result.wasHere).to.not.be.defined;
                    expect(result.wasHereSecond).to.be.not.undefined;
                    done();
                });

                new Chain('second', (context, param, next) => {
                    context.set('wasHereSecond', true);
                    expect(param.wasHere).to.be.not.undefined;
                    next()
                });
            });
            it('should execute the next chain specified on the third argument of the constructor', (done) => {
                const start = new Chain('start', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second').execute((result) => {
                    expect(result.wasHereSecond).to.be.not.undefined;
                    done();
                });

                new Chain('second', (context, param, next) => {
                    context.set('wasHereSecond', true);
                    expect(param.wasHere).to.be.not.undefined;
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
                    expect(param.wasHere).to.be.not.undefined;
                    next()
                });
            });

            it('should trigger the errorHandler chain specified on the fourth argument of the constructor', (done) => {
                const start = new Chain('start_', (context, param, next) => {
                    throw new Error('sample error');
                }, 'second', 'errorHandler_start_')
                    .execute((result) => {
                        expect(result.errorWasTriggered).to.be.not.undefined;
                        done();
                    });

                new Chain('errorHandler_start_', (context, param, next) => {
                    context.set('errorWasTriggered', true);
                    const name = param.$errorFrom();
                    expect(name).to.be.equal('start_');
                    next()
                });

            });


            it('should trigger the errorHandler chain with next(Error) for asycnhronous callback', (done) => {
                const start = new Chain('start_0', (context, param, next) => {
                    setTimeout(() => {
                        next(new Error('sample error'));
                    });
                }, 'second', 'errorHandler_start_0')
                    .execute((result) => {
                        expect(result.errorWasTriggered).to.be.not.undefined;
                        done();
                    });

                new Chain('errorHandler_start_0', (context, param, next) => {
                    context.set('errorWasTriggered', true);
                    const name = param.$errorFrom();
                    expect(name).to.be.equal('start_0');
                    next()
                });

            });

            it('should trigger the nearest errorHandler of the chain hierarchy', (done) => {
                const start = new Chain('start_1', (context, param, next) => {
                    next();
                }, 'second', 'errorHandler_start_1')
                    .execute((result) => {
                        expect(result.errorHandlerForStep2WasTriggered).to.be.not.undefined;
                        expect(result.errorWasTriggered).to.be.undefined;
                        done();
                    });

                new Chain('second', (context, param, next) => {
                    next();
                }, 'third', 'errorHandlerForStep2');

                new Chain('third', (context, param, next) => {
                    throw new Error('sample error');
                }, 'second');


                new Chain('errorHandler_start_1', (context, param, next) => {
                    context.set('errorWasTriggered', true);
                    next()
                });

                new Chain('errorHandlerForStep2', (context, param, next) => {
                    context.set('errorHandlerForStep2WasTriggered', true);
                    const name = param.$errorFrom();
                    expect(name).to.be.equal('third');
                    next()
                });

            });
        });
    });
    describe('memory', () => {
        it('should clone chain from ChainStorage when executing so context will be renewed every process', (done) => {
            let index = 0;
            new Chain('chain1', (context, param, next) => {
                context.set('firstname', 'john');
                context.set('lastname', 'doe');
                next();
            });
            const initialSize = ChainStorage['chain1']().size();
            ExecuteChain('chain1', {}, (result) => {
                const endSize = ChainStorage['chain1']().size();
                expect(endSize).to.be.equal(initialSize);
                done();
            });
        });
    });
});
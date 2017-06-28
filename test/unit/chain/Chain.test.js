import 'babel-polyfill';

import { Chain, ChainAction, ExecuteChain } from '../../../src/';
import { ChainStorage, getConfig } from '../../../src/chain/ChainStorage';

import { StrictModeEnabled } from '../../../src/chain/ChainSettings';
import chai from 'chai';
import sizeOf from 'object-sizeof';

const expect = chai.expect;

describe('Chain Unit', () => {
    before(() => {
        getConfig()['$cache'] = false;
        getConfig()['$strict'] = false;
    });
    describe('spec', () => {
        it('should add spec', () => {
            const chain = new Chain('helloN', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            chain.addSpec('sample', true, () => {
            });
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
            let count = 0;
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
                count++;
                next();
            }, 'hello_seq_0_1_trial');

            ExecuteChain(['hello_seq_0_0', 'hello_seq_0_1'], {}, (context) => {
                expect(context.hello_seq_1_trial).to.be.undefined;
                expect(context.hello_seq_1).to.be.not.undefined;
                expect(1).to.be.equal(count);
                done();
            });
        });
        it('should contain the main parameter throughout the chains', (done) => {
            new Chain('hello_seq_1_1', (context, param, next) => {
                const domain = [];
                domain.push('first');
                expect(param.host).to.be.not.undefined;
                context.set('from_hello_seq_1_1', true);
                context.set('host', 'trying to change');
                context.set('domain', domain);
                next();
            });
            new Chain('hello_seq_1_2', (context, param, next) => {
                const domain = param.domain();
                domain.push('second');
                expect(param.host).to.be.not.undefined;
                expect(param.from_hello_seq_1_1).to.be.not.undefined;
                expect(param.host()).to.be.not.equal('trying to change');
                context.set('from_hello_seq_1_2', true);
                context.set('domain', domain);
                next();
            });
            new Chain('hello_seq_1_3', (context, param, next) => {
                const domain = param.domain();
                domain.push('third');
                expect(param.host).to.be.not.undefined;
                expect(param.from_hello_seq_1_2).to.be.not.undefined;
                context.set('from_hello_seq_1_3', true);
                context.set('domain', domain);
                next();
            });

            ExecuteChain(['hello_seq_1_1', 'hello_seq_1_2', 'hello_seq_1_3'], {
                host: 'http://sample'
            }, result => {
                expect(result.from_hello_seq_1_3).to.be.not.undefined;
                expect(result.domain).to.be.not.undefined;
                expect(result.domain().length).to.be.equal(3);
                done();
            });
        });
        it('should throw an error if param contains functions', () => {
            new Chain('hello3', (context, param, next) => {
                context.set('saidHello', true);
                next();
            });
            expect(() => {
                ExecuteChain('hello3', {
                    hi: () => {
                    }
                }, (context) => {
                });
            }).to.throw(Error);

        });
    })
    describe('constructor', () => {
        it('should compute its size', () => {
            const chain = new Chain('sample0', () => {
            }, 'nextChain', 'errorHandler');
            console.log('chain', chain.size() + ' bytes');
        });
        it('should throw an error when Action is undefined', () => {
            expect(Chain).to.throw(Error);
        });
        it('should return UNTOUCHED as the initial status', () => {
            const chain = new Chain('sample1', () => {
            });
            const info = chain.info();
            expect(info.status).to.be.equal('UNTOUCHED');
        });
        it('should able to return name, next chain, errorHandler and initial status with info()', () => {
            const chain = new Chain('sample2', () => {
            }, 'nextChain', 'errorHandler');
            const info = chain.info();
            expect(info.name).to.be.equal('sample2');
            expect(info.status).to.be.equal('UNTOUCHED');
            expect(info.next).to.be.equal('nextChain');
            expect(info.errorHandler).to.be.equal('errorHandler');
        });
        it('should create a new context with its name as the owner()', (done) => {
            const chain = new Chain('sample3', (context, param, next) => {
                expect(context.$owner()).to.equal('sample3');
                next();
            });
            chain.execute(() => {
                done();
            });
        });
        it('should change the status to "DONE" once the process has finished', (done) => {
            const chain = new Chain('sample4', (context, param, next) => {
                expect(context.$owner()).to.equal('sample4');
                next();
            });
            chain.execute(() => {
                expect(chain.status() === 'DONE');
                done();
            });
        });
        it('should put in ChainStorage', () => {
            const chain = new Chain('sample5', () => {
            });
            expect(ChainStorage.sample5).to.be.not.undefined;
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
                }, 'second0').execute((result) => {
                    expect(result.wasHere).to.not.be.defined;
                    expect(result.wasHereSecond).to.be.not.undefined;
                    done();
                });

                new Chain('second0', (context, param, next) => {
                    context.set('wasHereSecond', true);
                    expect(param.wasHere).to.be.not.undefined;
                    next()
                });
            });
            it('should execute the next chain specified on the third argument of the constructor', (done) => {
                const start = new Chain('start0', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second1').execute((result) => {
                    expect(result.wasHereSecond).to.be.not.undefined;
                    done();
                });

                new Chain('second1', (context, param, next) => {
                    context.set('wasHereSecond', true);
                    expect(param.wasHere).to.be.not.undefined;
                    next()
                });
            });
            it('should get the previous chain context as param to the next chain', (done) => {
                const start = new Chain('start1', (context, param, next) => {
                    context.set('wasHere', true);
                    next();
                }, 'second2').execute((result) => {
                    done();
                });

                new Chain('second2', (context, param, next) => {
                    expect(param.wasHere).to.be.not.undefined;
                    next()
                });
            });

            it('should trigger the errorHandler chain specified on the fourth argument of the constructor', (done) => {
                const start = new Chain('start_', (context, param, next) => {
                    throw new Error('sample error');
                }, 'second3', 'errorHandler_start_')
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
                    expect(param.$next).to.be.not.undefined;
                    expect(param.$next()).to.be.equal('second');
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
    describe('Strict mode', () => {
        it('should only accepts parameter that is specified in addSpec()', (done) => {
            StrictModeEnabled();
            new Chain('StrictModeChain01', (context, param, next) => {
                context.set('name', 'John');
                context.set('surname', 'Wick');
                context.set('age', 'unknown');
                next();
            }, 'StrictModeChain02');

            const strictChain = new Chain('StrictModeChain02', (context, param, next) => {
                expect(param.name).to.be.not.undefined;
                expect(param.surname).to.be.not.undefined;
                expect(param.age).to.be.undefined;
                expect(param.$owner).to.be.not.undefined;
                context.set('fullname', param.name() + ' ' + param.surname());
                next();
            });

            strictChain.addSpec('name', true);
            strictChain.addSpec('surname', true)

            ExecuteChain('StrictModeChain01', {}, (result) => {
                if (result.$err) {
                }
                else {
                    expect(result.fullname).to.be.not.undefined;
                    expect(result.fullname()).to.be.equal('John Wick');
                    done();
                }
            });

        });
        it('should not get any parameter', (done) => {
            StrictModeEnabled();
            new Chain('StrictModeChain01_1', (context, param, next) => {
                context.set('name', 'John');
                context.set('surname', 'Wick');
                context.set('age', 'unknown');
                next();
            }, 'StrictModeChain02_1');

            new Chain('StrictModeChain02_1', (context, param, next) => {
                expect(param.name).to.be.undefined;
                expect(param.surname).to.be.undefined;
                expect(param.age).to.be.undefined;
                expect(param.$owner).to.be.not.undefined;
                next();
            }, null, null);

            ExecuteChain('StrictModeChain01_1', {}, (result) => {
                if (result.$err) {
                }
                else {
                    done();
                }
            });
        });
    });
    describe('Chain decorator', () => {
        it('should set decoration target chain constant', () => {
            class Sample {
                @ChainAction
                ChainNameSampleOne(context, param, next) {
                    context.set('ChainNameSampleOneGotHere', true);
                    next();
                }
            }
            const sm = new Sample();
            expect(sm).to.be.not.undefined;
            expect(sm.CHAIN_CHAINNAMESAMPLEONE).to.be.equal('ChainNameSampleOne');
        });
        it('should run the chain in decorator', (done) => {
            class Sample {
                @ChainAction
                ChainNameSampleTwo(context, param, next) {
                    context.set('ChainNameSampleTwoGotHere', true);
                    next();
                }
            }
            const sm = new Sample();
            ExecuteChain(sm.CHAIN_CHAINNAMESAMPLETWO, {}, result => {
                expect(result.ChainNameSampleTwoGotHere).to.be.not.undefined;
                expect(result.ChainNameSampleTwoGotHere()).to.be.true;
                done();
            });
        });
        it('should run multiple chains using the decorator', (done) => {
            class Sample {
                @ChainAction
                ChainNameSampleThree(context, param, next) {
                    context.set('ChainNameSampleThreeGotHere', true);
                    next();
                }
                @ChainAction
                ChainNameSampleFour(context, param, next) {
                    context.set('ChainNameSampleFourGotHere', true);
                    next();
                }
            }
            const sm = new Sample();
            ExecuteChain([sm.CHAIN_CHAINNAMESAMPLETHREE, sm.CHAIN_CHAINNAMESAMPLEFOUR], {}, result => {
                expect(result.ChainNameSampleFourGotHere).to.be.not.undefined;
                expect(result.ChainNameSampleFourGotHere()).to.be.true;
                done();
            });
        });
    });
});
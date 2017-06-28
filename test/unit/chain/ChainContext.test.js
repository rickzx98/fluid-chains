import 'babel-polyfill';

import ChainContext from '../../../src/chain/ChainContext';
import ChainSpec from '../../../src/chain/ChainSpec';
import assert from 'assert';
import chai from 'chai';
import sizeOf from 'object-sizeof';

const expect = chai.expect;


describe('ChainContext Unit', () => {
    describe('validator', () => {
        it('should throw error if required field is empty', () => {
            const spec = new ChainSpec('sampleField', true);
            expect(() => {
                const context = new ChainContext();
                context.addValidator(spec);
                context.validate(new ChainContext());
            }).to.throw('Field sampleField is required.');
        });
        it('should throw error if custom validation field', () => {
            const spec = new ChainSpec('sampleField', true, (value, valid) => {
                valid(value === 'hi', 'Value is not hi.');
            });
            expect(() => {
                const context = new ChainContext();
                context.addValidator(spec);
                const param = new ChainContext();
                param.set('sampleField', 'hello');
                context.validate(param);
            }).to.throw('Value is not hi.');
        });
    });

    describe('set', () => {
        it('should return value as function', () => {
            const context = new ChainContext();
            context.set('hello', 'hi');
            assert(context.hello instanceof Function);
        });
        it('should set value', () => {
            const context = new ChainContext();
            context.set('hello', 'hi');
            assert(context.hello() === 'hi');
        });
        it('should not be mutated', () => {
            const context = new ChainContext();
            context.set('hello', {remark: 'hi'});
            context.hello().remark = 'hello';
            assert(context.hello().remark === 'hi');
        });
        it('should throw an error if a Function is set to value', () => {
            const context = new ChainContext();
            expect(() => {
                context.set('tryFunction', () => {
                });
            }).to.throw(Error);
        });
        it('should throw an error when setting immutable field twice', () => {
            const context = new ChainContext();
            context.addValidator(new ChainSpec('name', true, undefined, true));
            expect(() => {
                context.set('name', 'hello');
                context.set('name', 'hello again');
            }).to.throw('Field name is already defined and is marked readOnly.');
        });
    });

    describe('copy', () => {
        it('should make its own copy', () => {
            const context = new ChainContext();
            context.addValidator(new ChainSpec('phone', true));
            context.set('id', '123405');
            context.set('person', {
                firstname: 'Jane',
                lastname: 'Doe'
            });
            context.set('$error', 'errorChain');
            const clone = context.clone();
            expect(context.addValidator).to.not.be.undefined;
            expect(context.id).to.not.be.defined;
            expect(context.person).to.not.be.defined;
            expect(clone.$error).to.not.be.undefined;
            expect(clone.id()).to.be.equal('123405');
            expect(clone.person).to.not.be.undefined;
            const person = clone.person();
            expect(person.firstname).to.be.equal('Jane');
            expect(person.lastname).to.be.equal('Doe');
            clone.set('newValue', 'hello');
            expect(clone.newValue()).to.be.equal('hello');
            expect(() => {
                context.validate(clone);
            }).to.throw('Field phone is required.');
        });
    });

    describe('clone for parameter', () => {
        it('should only get the value of the specified field', () => {
            const context1 = new ChainContext();
            context1.set('name', 'John');
            context1.set('lastName', 'Wick');
            const context2 = new ChainContext();
            context2.addValidator(new ChainSpec('name', true));
            const clonedContext = context1.cloneFor(context2);
            expect(clonedContext instanceof ChainContext).to.be.true;
            expect(clonedContext).to.be.not.undefined;
            expect(clonedContext.name).to.be.not.undefined;
            expect(clonedContext.lastName).to.be.undefined;
        });
    });

    describe('spec properties', ()=> {
        it('should initialize all spec with default value', () => {
            const spec = new ChainSpec('sampleField');
            spec.default('hello');
            const context = new ChainContext();
            context.addValidator(spec);
            context.initDefaults();
            expect(context.sampleField).to.be.not.undefined;
            expect(context.sampleField()).to.be.equal('hello');
            context.set('sampleField', 'hi');
            expect(context.sampleField()).to.be.equal('hi');
        });

        it('should make the field required', () => {
            const spec = new ChainSpec('sampleField');
            spec.require();
            const context = new ChainContext();
            context.addValidator(spec);
            expect(() => {
                context.validate(new ChainContext());
            }).to.throw('Field sampleField is required.');
        });

        it('should be able to add custom validator using validator function', () => {
            const spec = new ChainSpec('sampleField');
            spec.validator((value, valid) => {
                valid(value === 'hi', 'Value is not hi.');
            });
            expect(() => {
                const context = new ChainContext();
                context.addValidator(spec);
                const param = new ChainContext();
                param.set('sampleField', 'hello');
                context.validate(param);
            }).to.throw('Value is not hi.');
        });
    });
});
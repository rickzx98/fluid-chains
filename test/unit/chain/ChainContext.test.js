import 'babel-polyfill';

import ChainContext from '../../../src/chain/ChainContext';
import { ChainSpec } from '../../../src/chain/Chain';
import assert from 'assert';
import chai from 'chai';
import sizeOf from 'object-sizeof';

const expect = chai.expect;


describe('ChainContext Unit', () => {
    describe('validator', () => {
        it('should throw error if required field is empty', () => {
            const spec = new ChainSpec('sampleField', true);
            expect(() => {
                const context = new ChainContext('sample');
                context.addValidator(spec);
                const clone = context.clone();
                clone.validate();
            }).to.throw('Field sampleField is required.');
        });
        it('should throw error if custom validation field', () => {
            const spec = new ChainSpec('sampleField', true, (value, valid) => {
                valid(value === 'hi', 'Value is not hi.');
            });
            expect(() => {
                const context = new ChainContext('sample');
                context.set('sampleField', 'hello');
                context.addValidator(spec);
                context.clone().validate();
            }).to.throw('Value is not hi.');
        });
    });
    describe('constructor', () => {
        it('should have $owner', () => {
            const context = new ChainContext('sample');
            assert(context.$owner() === 'sample');
        });
        it('should throw error if $owner is not specified', () => {
            expect(ChainContext).to.throw(Error);
        });
    });

    describe('set', () => {
        it('should return value as function', () => {
            const context = new ChainContext('sample');
            context.set('hello', 'hi');
            assert(context.hello instanceof Function);
        });
        it('should set value', () => {
            const context = new ChainContext('sample');
            context.set('hello', 'hi');
            assert(context.hello() === 'hi');
        });
        it('should not be mutated', () => {
            const context = new ChainContext('sample');
            context.set('hello', { remark: 'hi' });
            context.hello().remark = 'hello';
            assert(context.hello().remark === 'hi');
        });
        it('should throw an error if a Function is set to value', () => {
            const context = new ChainContext('sample');
            expect(() => {
                context.set('tryFunction', () => { });
            }).to.throw(Error);
        });
    });

    describe('copy', () => {
        it('should make its own copy', () => {
            const context = new ChainContext('copyContext');
            context.addValidator(new ChainSpec('phone', true));
            context.set('id', '123405');
            context.set('person', {
                firstname: 'Jane',
                lastname: 'Doe'
            });
            const initialSize = sizeOf(context);
            const clone = context.clone();
            expect(context.$owner).to.be.defined;
            expect(context.addValidator).to.be.defined;
            expect(context.id).to.not.be.defined;
            expect(context.person).to.not.be.defined;

            expect(sizeOf(context) < initialSize).to.be.true;

            expect(clone.$owner()).to.be.equal('copyContext');
            expect(clone.id()).to.be.equal('123405');
            expect(clone.person).to.be.defined;
            const person = clone.person();
            expect(person.firstname).to.be.equal('Jane');
            expect(person.lastname).to.be.equal('Doe');
            clone.set('newValue', 'hello');
            expect(clone.newValue()).to.be.equal('hello');
            expect(() => {
                clone.validate();
            }).to.throw('Field phone is required.');
        });
    });
});
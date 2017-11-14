import 'babel-polyfill';

import Context from '../../../../src/chain/context/';
import Spec from '../../../../src/chain/spec/'
import { expect } from 'chai';

describe.only('spec.unit.test', () => {

    it('should create spec with field name', () => {
        const spec = new Spec('fieldName');
        expect(spec).to.be.not.undefined;
        expect(spec.field).to.be.not.undefined;
        expect(spec.field).to.be.equal('fieldName');
    });

    it('should throw an error if field name is not specified', () => {
        expect(() => {
            new Spec();
        }).to.throw("Field name is required.");
    });

    it('should add spec actions', () => {
        const spec = new Spec('field');
        spec.require();
        expect(spec.actions[0]).to.be.equal('require');
        spec.transform();
        expect(spec.actions[1]).to.be.equal('transform');
        spec.translate();
        expect(spec.actions[2]).to.be.equal('translate');
        spec.default('hello');
        expect(spec.actions[3]).to.be.equal('default');
        spec.validate();
        expect(spec.actions[4]).to.be.equal('validate');
    });

    it('should set a custom validator', done => {
        const context = new Context('_chained00');
        const spec = new Spec('validationField');
        spec.validate((currentValue) => new Promise((resolve, reject)=> {
            if (currentValue > 0) {
                resolve();
            } else {
                reject('Value must be greater than 0');
            }
        }));
        context.set('validationField', 0);
        spec.runValidation(context)
            .catch(error => {
                expect(error).to.be.equal('Value must be greater than 0');
                done();
            });
    });

    it('should set context field default value', () => {
        const context = new Context('_chained01');
        const spec = new Spec('defaultField');
        spec.default('defaultValue');
        context.addValidator(spec);
        spec.runDefault(context);
        expect(context.getData()['defaultField']).to.be.not.undefined;
        expect(context.getData()['defaultField']()).to.be.equal('defaultValue');
    });

    it('should asynchronously change the field value', done => {
        const context = new Context('_chained02');
        const spec = new Spec('transformThisField');
        context.set('transformThisField', 'Hello world!');
        spec.transform(currentValue => new Promise(resolve => {
            resolve('hello');
        }));
        spec.runTransform(context)
            .then(() => {
                expect(context.getData()['transformThisField']()).to.be.equal('hello');
                done();
            });

    });

    it('should asynchronously translate the field value', done => {
        const context = new Context('_chained02');
        const spec = new Spec('transformThisField');
        context.set('translateThisField', 'Hello world!');
        spec.translate((currentValue, context) => new Promise(resolve => {
            context.set('hello', 'hello');
            context.set('world', 'world');
            resolve();
        }));
        spec.runTranslate(context)
            .then(() => {
                expect(context.getData()['hello']()).to.be.equal('hello');
                expect(context.getData()['world']()).to.be.equal('world');
                done();
            });

    });
});

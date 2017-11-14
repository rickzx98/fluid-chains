import 'babel-polyfill';

import Context from '../../../../src/chain/context/';
import Spec from '../../../../src/chain/spec/';
import { expect } from 'chai';

describe.only('context.unit.test', () => {

    it('should create new context', () => {
        const context = new Context('0001');
        expect(context).to.be.not.undefined;
    });

    it('should set context value', () => {
        const context = new Context('0002');
        expect(context).to.be.not.undefined;
        context.set('sampleField', 'sampleValue');
        const contextData = context.getData();
        expect(contextData.sampleField).to.be.not.undefined;
        expect(contextData.sampleField()).to.be.equal('sampleValue');
    });

    it('should add validator', () => {
        const context = new Context('0003');
        expect(context).to.be.not.undefined;
        context.set('sampleField', 'sampleValue');
        context.addValidator({ name: 'spec' });
        const contextData = context.getData();
        expect(contextData.sampleField).to.be.not.undefined;
        expect(contextData.sampleField()).to.be.equal('sampleValue');
        expect(contextData.$$$validators).to.be.not.undefined;
        expect(contextData.$$$validators()[0].name).to.be.equal('spec');
    });

    it('should validate the context values', done => {
        const context = new Context('0004');
        const spec = new Spec('field_1');
        spec.require('Field 1 is required');
        const spec2 = new Spec('field_2');
        spec2.require('Field 2 is required');

        context.addValidator(spec);
        context.addValidator(spec2);
        context.set('field_1', 'value');
        context.validate().catch(error => {
            expect(error.message).to.be.equal('Field 2 is required'); done();
        });
    });
});

import 'babel-polyfill';

import Context from '../../../../src/chain/context/'
import { expect } from 'chai';

describe('context.unit.test', () => {

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
});

import 'babel-polyfill';

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

});

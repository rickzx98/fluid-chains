import lodash from 'lodash';

export default class ChainContext {
    constructor() {
        this.validators = [];
        this.addValidator = (fieldSpec) => {
            this.validators.push(fieldSpec);
        }
    }
    set(name, value) {
        const fieldSpec = lodash.filter(this.validators, spec => spec.field === name);
        if (fieldSpec && fieldSpec.length) {
            if (fieldSpec[0].immutable && lodash.get(this, name)) {
                throw new Error('Field ' + name + ' is already defined and is marked immutable.');
            }
        }
        if (value instanceof Function) {
            throw new Error('Function cannot be set as value');
        }
        lodash.set(this, name, () => lodash.clone(value));
    }
    clone() {
        const copy = {};
        const validators = lodash.clone(this.validators) || [];
        lodash.forIn(this, (field, key) => {
            if (key !== 'addValidator' &&
                key !== 'validate' &&
                key !== 'set') {
                if (field instanceof Function) {
                    const value = field();
                    lodash.set(copy, key, () => lodash.clone(value));
                }
            }
        });
        copy.set = (name, value) => {
            if (value instanceof Function) {
                throw new Error('Function cannot be set as value');
            }
            lodash.set(copy, name, () => lodash.clone(value));
        };
        copy.validate = () => {
            validators.forEach(validator => validator.validate(copy));
        }
        return copy;
    }

}
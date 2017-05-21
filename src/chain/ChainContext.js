import lodash from 'lodash';

export default class ChainContext {
    constructor(name) {
        this.validators = [];
        if (!name) {
            throw new Error('Owner name is required.');
        }
        this.set('$owner', name);
        this.addValidator = (fieldSpec) => {
            this.validators.push(fieldSpec);
        }
    }
    set(name, value) {
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
                if (key !== '$owner') {
                    lodash.unset(this, key);
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
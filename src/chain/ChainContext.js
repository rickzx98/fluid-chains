import lodash from 'lodash';

export default class ChainContext {
    constructor(validators) {
        this.validators = validators || {};
        this.addValidator = (fieldSpec) => {
            this.validators[fieldSpec.field] = fieldSpec;
        }
    }

    set(name, value) {
        const fieldSpec = this.validators[name];
        if (fieldSpec && fieldSpec.immutable && lodash.get(this, name)) {
            throw new Error('Field ' + name + ' is already defined and is marked immutable.');
        }
        if (value instanceof Function) {
            throw new Error('Function cannot be set as value');
        }
        lodash.set(this, name, () => lodash.clone(value));
    }

    clone() {
        const validators = lodash.clone(this.validators) || {};
        const copy = new ChainContext(validators);
        lodash.forIn(this, (field, key) => {
            if (key !== 'addValidator' &&
                key !== 'validate' &&
                key !== 'set') {
                if (field instanceof Function) {
                    const value = field();
                    copy.set(key, value);
                }
            }
        });
        return copy;
    }

    cloneFor(context) {
        if (!(context instanceof ChainContext)) {
            throw new Error('Argument must be an instance of ChainContext');
        }
        const validators = lodash.clone(this.validators) || {};
        const copy = new ChainContext(validators);
        lodash.forIn(this, (field, key) => {
            if (key !== 'addValidator' &&
                key !== 'validate' &&
                key !== 'set' && context.validators && context.validators[key]) {
                if (field instanceof Function) {
                    const value = field();
                    copy.set(key, value);
                }
            } else if (key === '$error' || key === '$owner' || key === '$errorMessage' || key === '$next' || key === '$err') {
                const value = field();
                copy.set(key, value);
            }
        });
        return copy;
    }

    validate(param) {
        lodash.forIn(this.validators, validator => validator.validate(param));
    }
}
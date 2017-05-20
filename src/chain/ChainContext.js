import lodash from 'lodash';

export default class ChainContext {
    constructor(name) {
        const validators = [];
        if (!name) {
            throw new Error('Owner name is required.');
        }
        this.set('$owner', name);
        this.addValidator = (fieldSpec) => {
            validators.push(fieldSpec);
        }
        this.validate = () => {
            validators.forEach(validator => validator.validate(this));
        }
    }
    set(name, value) {
        if (value instanceof Function) {
            throw new Error('Function cannot be set as value');
        }
        lodash.set(this, name, () => lodash.clone(value));
    }

}
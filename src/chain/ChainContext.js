import { batch, batchIn } from './Util';

import lodash from 'lodash';

export default class ChainContext {
    constructor(validators) {
        this.validators = validators || {};
        this.addValidator = (fieldSpec) => {
            this.validators[fieldSpec.field] = fieldSpec;
        }
    }

    set(name, value) {
        if (value instanceof Function) {
            throw new Error('Function cannot be set as value');
        }
        lodash.set(this, name, () => lodash.clone(value));
    }

    clone() {
        const validators = this.validators || {};
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
        const validators = this.validators || {};
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

    merge(context) {
        const validators = this.validators || {};
        const copy = new ChainContext(validators);
        lodash.forIn(this, (field, key) => {
            if (key !== 'addValidator' &&
                key !== 'validate' &&
                key !== 'set') {
                if (field instanceof Function) {
                    const value = field();
                    copy.set(key, value);
                }
            } else if (key === '$error' || key === '$owner' || key === '$errorMessage' || key === '$next' || key === '$err') {
                const value = field();
                copy.set(key, value);
            }
        });

        lodash.forIn(context, (field, key) => {
            if (key !== 'addValidator' &&
                key !== 'validate' &&
                key !== 'set') {
                if (field instanceof Function) {
                    const value = field();
                    if (!lodash.get(copy, key)) {
                        copy.set(key, value);
                    }
                }
            }
        });
        return copy;
    }

    copy(context) {
        lodash.forIn(context, (field, key) => {
            if (key !== 'addValidator' &&
                key !== 'validate' &&
                key !== 'set') {
                if (field instanceof Function) {
                    const value = field();
                    if (!lodash.get(this, key)) {
                        this.set(key, value);
                    }
                }
            }
        });
    }

    //@deprecated
    validate(param) {
        lodash.forIn(this.validators, validator => validator.validate(param));
    }

    //@deprecated
    transform(context) {
        lodash.forIn(context.validators, (validator, field) => {
            if (validator.transformer) {
                const currentValue = lodash.get(this, field);
                if (currentValue) {
                    validator.transformer(currentValue(), (newValue) => {
                        this.set(field, newValue);
                    });
                }
            }
        });
    }

    //@deprecated
    initDefaults(context) {
        lodash.forIn(context.validators, (validator, field) => {
            if (validator.defaultValue && !lodash.get(this, field)) {
                this.set(field, validator.defaultValue);
            }
        });
    }

    initSpecs(param, done) {
        batchIn(this.validators,
            (validator, next) => {
                if (validator) {
                    batch(validator.getSpecsSequence(), (sequence, nextSequence) => {
                        switch (sequence) {
                            case 'default':
                                validator.initDefault(param);
                                nextSequence();
                                break;
                            case 'require':
                            case 'validator':
                                validator.validate(param, (err) => {
                                    if (err) {
                                        done(err);
                                    } else {
                                        nextSequence();
                                    }
                                });
                                break;
                            case 'transform':
                                validator.initTransformer(param, () => {
                                    nextSequence();
                                });
                                break;
                            case 'translate':
                                validator.initTranslator(param);
                                nextSequence();
                                break;
                        }

                    }, next);
                }
            }, done);
    }
}
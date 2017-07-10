import ChainContext from './ChainContext';
import lodash from 'lodash';

export default class ChainSpec {
    constructor(field, required, customValidator) {
        if (customValidator && !(customValidator instanceof Function)) {
            throw new Error('customValidator must be a Function instance.');
        }
        const specActions = [];

        this.field = field;
        this.required = required;
        this.validate = (context, done) => {
            if (this.required && (!context[field] || context[field]() === '')) {
                if (done) {
                    done(new Error(this.requiredMessage || `Field ${field} is required.`));
                }
                else {
                    throw new Error(this.requiredMessage || `Field ${field} is required.`);
                }
            }
            if (customValidator && context[field]) {
                customValidator(context[field](), (valid, message) => {
                    if (!valid) {
                        if (done) {
                            done(new Error(message || `Validation failed for field ${field}`));
                        } else {
                            throw new Error(message || `Validation failed for field ${field}`);
                        }
                    } else {
                        if (done) {
                            done();
                        }
                    }
                });
            }
        };

        this.initDefault = (context) => {
            if (!lodash.get(context, field)) {
                context.set(field, this.defaultValue);
            }
        }

        this.initTransformer = (context, done) => {
            const currentValue = lodash.get(context, field);
            if (currentValue) {
                this.transformer(currentValue(), (newValue) => {
                    context.set(field, newValue);
                    done();
                });
            } else {
                done();
            }
        }

        this.initTranslator = (context) => {
            const currentValue = lodash.get(context, field);
            if (currentValue) {
                const newContext = new ChainContext();
                this.translator(currentValue(), newContext);
                context.copy(newContext);
            }
        }

        this.default = (defaultValue) => {
            this.defaultValue = defaultValue;
            specActions.push('default');
            return this;
        };

        this.require = (message) => {
            this.required = true;
            this.requiredMessage = message;
            specActions.push('require');
            return this;
        };

        this.validator = (validator) => {
            customValidator = validator;
            if (customValidator && !(customValidator instanceof Function)) {
                throw new Error('customValidator must be a Function instance.');
            }
            specActions.push('validator');
            return this;
        };

        this.transform = (transformer = (currentValue, done = (newValue) => { }) => { }) => {
            this.transformer = transformer;
            specActions.push('transform');
            return this;
        }

        this.translate = (translator = (currentValue, context) => { }) => {
            this.translator = translator;
            specActions.push('translate');
            return this;
        };

        this.getSpecsSequence = () => {
            return specActions;
        }
    }
}
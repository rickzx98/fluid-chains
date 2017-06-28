export default class ChainSpec {
    constructor(field, required, customValidator, once) {
        if (customValidator && !(customValidator instanceof Function)) {
            throw new Error('customValidator must be a Function instance.');
        }
        this.field = field;
        this.required = required;
        this.once = once;
        this.validate = (context) => {
            if (this.required && (!context[field] || context[field]() === '')) {
                throw new Error(this.requiredMessage || `Field ${field} is required.`);
            }
            if (customValidator && context[field]) {
                customValidator(context[field](), (valid, message) => {
                    if (!valid) {
                        throw new Error(message || `Validation failed for field ${field}`);
                    }
                });
            }
        };

        this.default = (defaultValue)=> {
            this.defaultValue = defaultValue;
            return this;
        };

        this.require = (message) => {
            this.required = true;
            this.requiredMessage = message;
            return this;
        };

        this.validator = (validator)=> {
            customValidator = validator;
            if (customValidator && !(customValidator instanceof Function)) {
                throw new Error('customValidator must be a Function instance.');
            }
            return this;
        };

        this.writeOnce = ()=> {
            this.once = true;
            return this;
        }
    }
}
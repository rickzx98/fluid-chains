export default class ChainSpec {
    constructor(field, required, customValidator, readOnly) {
        if (customValidator && !(customValidator instanceof Function)) {
            throw new Error('customValidator must be a Function instance.');
        }
        this.field = field;
        this.required = required;
        this.validate = (context) => {
            if (required && (!context[field] || context[field]() === '')) {
                throw new Error('Field ' + field + ' is required.');
            }
            if (customValidator && context[field]) {
                customValidator(context[field](), (valid, message) => {
                    if (!valid) {
                        throw new Error(message || 'Validation failed for field ' + field);
                    }
                });
            }
        }
        this.readOnly = readOnly;
    }
}
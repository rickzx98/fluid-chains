const VALIDATORS = '$$$validators';
export class Validators {
    constructor(chainId, getChainContext) {
        const validators = getChainContext(chainId, VALIDATORS);
        this.fieldSpecs = validators ? validators() : [];
        this.validators = validators;
        this
    }
    addSpec(fieldSpec, setChainContextValue) {
        const validators = Object.assign([], [...this.fieldSpecs, fieldSpec]);
        setChainContextValue(VALIDATORS, validators);
    }

    runValidations(context) {
        const validators = this.validators().map(validator => validator.runValidation(context));
        return Promise.all(validators);
    }
}
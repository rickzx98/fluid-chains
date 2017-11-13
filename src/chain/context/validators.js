const VALIDATORS = '$$$validators';
export class Validators {
    constructor(chainId, getChainContext) {
        const validators = getChainContext(chainId, VALIDATORS);
        this.fieldSpecs = validators ? validators() : [];
    }
    addSpec(fieldSpec, setChainContextValue) {
        const validators = Object.assign([], [...this.fieldSpecs, fieldSpec]);
        setChainContextValue(VALIDATORS, validators);
    }
}
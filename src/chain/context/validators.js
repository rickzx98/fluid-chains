const VALIDATORS = '$$$validators';
export class Validators {
    constructor(chainId, setChainContextValue, getChainContext) {
        const context = getChainContext(chainId);
        this.fieldSpecs = context[VALIDATORS] ? context[VALIDATORS]() : [];
    }

    addSpec(fieldSpec) {
        const validators = Object.assign([], [...this.fieldSpecs, fieldSpec]);
        setChainContextValue(VALIDATORS, validators);
    }
}
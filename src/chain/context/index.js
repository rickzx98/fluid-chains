import { getChain, getChainContext, putChainContext } from '../storage/';

import { GetContext } from './get';
import { Validators } from './validators';
import { isValidJson } from '../Util';
import { setContextValue } from './set';

export default class Context {
    constructor(chainId) {
        this.chainId = chainId;
    }

    set(name, value) {
        setContextValue(isValidJson, putChainContext, getChainContext, this, this.chainId, name, value);
    }

    addValidator(fieldSpec) {
        new Validators(this.chainId, getChainContext)
            .addSpec(fieldSpec, this.set.bind(this));
    }

    getData() {
        return new GetContext(this.chainId, getChain).getContext();
    }

    validate() {
        return new Validators(this.chainId, getChainContext).runValidations(this);
    }

    runSpecs() {
        return new Validators(this.chainId, getChainContext).runSpecs(this);
    }
}
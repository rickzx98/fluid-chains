import { getChainContext, getChainDataById, putChainContext } from '../storage/';

import { GetContext } from './get';
import { Validators } from './validators';
import { setContextValue } from './set';

export default class Context {
    constructor(chainId) {
        this.chainId = chainId;
    }

    set(name, value) {
        setContextValue(putChainContext, this.chainId, name, value);
    }

    addSpec(fieldSpec) {
        new Validators(this.chainId, getChainContext.bind(this))
            .addSpec(fieldSpec, this.set.bind(this));
    }

    getData() {
        return new GetContext(this.chainId, getChainDataById.bind(this)).getContext();
    }

    validate() {
        return new Validators(this.chainId, getChainContext.bind(this)).runValidations(this);
    }

    runSpecs() {
        return new Validators(this.chainId, getChainContext.bind(this)).runSpecs(this);
    }

    static createContext(chainId) {
        const context = new Context(chainId);
        context.set('$chainId', chainId);
        return context;
    }
}
import { getChainContext, getChainDataById, putChainContext } from '../storage/';

import { GetContext } from './get';
import { Validators } from './validators';
import { setContextValue } from './set';

export default class Context {
    constructor(chainId) {
        this.chainId = chainId;
    }

    set(name, value) {
        setContextValue(putChainContext, getChainContext, this, this.chainId, name, value);
    }

    addSpec(fieldSpec) {
        new Validators(this.chainId, getChainContext)
            .addSpec(fieldSpec, this.set.bind(this));
    }

    getData() {
        return new GetContext(this.chainId, getChainDataById).getContext();
    }

    validate() {
        return new Validators(this.chainId, getChainContext).runValidations(this);
    }

    runSpecs(context) {
        return new Validators(this.chainId, getChainContext).runSpecs(context || this);
    }

    static createContext(chainId){
        const context = new Context(chainId);
        context.set('$chainId', chainId);
        return context;
    }
}
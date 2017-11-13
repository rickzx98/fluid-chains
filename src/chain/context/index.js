import { getChainContext, putChainContext } from '../storage/';

import { Validator } from './validators';
import { clone } from './clone';
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
        new Validator(this.chainId, this.set, getChainContext)
            .addSpec(fieldSpec);
    }
}
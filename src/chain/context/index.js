import {isValidJson} from '../Util';
import {putChainContext, getChainContext} from '../storage/';
import {setContextValue} from './set';
export default class Context {
    constructor(chainId) {
        this.chainId = chainId;
    }

    set(name, value) {
        setContextValue(isValidJson, putChainContext, getChainContext, this, this.chainId, name, value);
    }


}
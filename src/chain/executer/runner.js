import { ArrayChain } from './array-chain';
import Context from "../context/index";
import { SingleChain } from './single-chain';
import { generateUUID } from "../Util";
import { getChain } from "../storage/index";

export class Runner {
    constructor(getChain, generateUUID, Context) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
    }
    start(param, chains) {
        if (chains instanceof Array) {
            return new ArrayChain(this.getChain, this.generateUUID, this.Context,
                new SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext)
            ).start(param, chains);
        } else {
            return new SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext)
                .start(param, chains);
        }
    }
}
const propertyToContext = (context, chainReturn) => {
    if (chainReturn) {
        if (chainReturn instanceof Object) {
            for (let name in chainReturn) {
                if (chainReturn.hasOwnProperty(name)) {
                    context.set(name, chainReturn[name]);
                }
            }
        } else {
            context.set('value', chainReturn);
        }
    }
}

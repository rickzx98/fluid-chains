export class Runner {
    constructor(getChain, generateUUID, Context, SingleChain, ArrayChain) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.SingleChain = SingleChain;
        this.ArrayChain = ArrayChain;
    }
    start(param, chains) {
        if (chains instanceof Array) {
            return new this.ArrayChain(this.getChain, this.generateUUID, this.Context,
                new this.SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext)
            ).start(param, chains);
        } else {
            return new this.SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext)
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

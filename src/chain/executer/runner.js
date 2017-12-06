export class Runner {
    constructor(getChain, generateUUID, Context, SingleChain, ArrayChain, Reducer, Util) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.SingleChain = SingleChain;
        this.ArrayChain = ArrayChain;
        this.Reducer = Reducer;
        this.Util = Util;
    }
    start(param, chains) {
        const newParam = this.Util.convertToContextStructure(param);
        if (chains instanceof Array) {
            return new this.ArrayChain(this.getChain, this.generateUUID, this.Context,
                new this.SingleChain(this.getChain, this.generateUUID,
                    this.Context, propertyToContext, this.Reducer)
            ).start(newParam, chains);
        } else {
            return new this.SingleChain(this.getChain, this.generateUUID,
                this.Context, propertyToContext, this.Reducer)
                .start(newParam, chains);
        }
    }
}
const propertyToContext = (context, chainReturn) => {
    if (chainReturn !== undefined) {
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
};

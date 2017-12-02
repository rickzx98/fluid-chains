export class SingleChain {
    constructor(getChain, generateUUID, Context, propertyToContext, Reducer) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
    }
    start(param, chains) {
        return new Promise((resolve, reject) => {
            try {
                const chain = this.getChain(chains);
                const chainId = this.generateUUID();
                const action = chain.action(param);
                if (chain.reducer && param[chain.reducer]) {
                    const array = param[chain.reducer]();
                } else {
                    if (action) {
                        const context = new this.Context(chainId);
                        if (action instanceof Promise) {
                            action.then(props => {
                                this.propertyToContext(context, props);
                                resolve(context.getData());
                            }).catch(err => reject);
                        } else {
                            this.propertyToContext(context, action);
                            resolve(context.getData());
                        }
                    }
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}
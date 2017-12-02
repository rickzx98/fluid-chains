export class Reducer {
    constructor(array, param, chainName, getChain, generateUUID, Context, propertyToContext) {
        this.array = array;
        this.param = param;
        this.chainName = chainName;
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
    }
    reduce(done, accumulated, current, index = 0) {
        try {
            const chain = this.getChain(this.chainName);
            if (this.array && this.array.length > 0) {
                const currentValue = this.shift();
                const action = chain.action(this.param, this.current, index);
                const chainId = this.generateUUID();
                if (action) {
                    const context = new this.Context(chainId);
                    if (action instanceof Promise) {
                        action.then(props => {
                            this.propertyToContext(context, props);
                            accumulated = Object.assign(accumulated, context.getData());
                            new Reducer(this.array, this.param, this.chainName, this.getChain,
                                this.generateUUID, this.Context, this.propertyToContext)
                                .reduce(done, accumulated, context.getData(), ++index);
                        }).catch(err => reject);
                    } else {
                        this.propertyToContext(context, action);
                        accumulated = Object.assign(accumulated, context.getData());
                        new Reducer(this.array, this.param, this.chainName, this.getChain,
                            this.generateUUID, this.Context, this.propertyToContext)
                            .reduce(done, accumulated, context.getData(), ++index);
                    }
                }
            } else {
                done(undefined, accumulated);
            }
        } catch (err) {
            done(err);
        }

    }
}
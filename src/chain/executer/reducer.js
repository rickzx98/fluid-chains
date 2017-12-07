export class Reducer {
    constructor(array, param, chainName, getChain, Context, propertyToContext) {
        this.array = array;
        this.param = param;
        this.chainName = chainName;
        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
    }

    reduce(done, accumulated = {}, index = 0) {
        try {
            const chain = this.getChain(this.chainName);
            if (this.array && this.array.length > index) {
                const currentValue = this.array[index];
                const action = chain.action(Object.assign(this.param, accumulated), currentValue, index);
                if (action !== undefined) {
                    const context = new this.Context(chain.$chainId);
                    if (action instanceof Promise) {
                        action.then(props => {
                            this.propertyToContext(context, props);
                            new Reducer(this.array, this.param, this.chainName, this.getChain,
                                this.generateUUID, this.Context, this.propertyToContext)
                                .reduce(done, context.getData(), ++index);
                        }).catch(err => reject);
                    } else {
                        this.propertyToContext(context, action);
                        new Reducer(this.array, this.param, this.chainName, this.getChain,
                            this.generateUUID, this.Context, this.propertyToContext)
                            .reduce(done, context.getData(), ++index);
                    }
                } else {
                    new Reducer(this.array, this.param, this.chainName, this.getChain,
                        this.generateUUID, this.Context, this.propertyToContext)
                        .reduce(done, accumulated, ++index);
                }
            } else {
                done(undefined, accumulated);
            }
        } catch (err) {
            done(err);
        }

    }
}
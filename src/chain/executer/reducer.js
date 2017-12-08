export class Reducer {
    constructor(array, param, chain, Context, propertyToContext) {
        this.array = array;
        this.param = param;
        this.chain = chain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
    }

    reduce(done, accumulated = {}, index = 0) {
        try {
            if (this.array && this.array.length > index) {
                const currentValue = this.array[index];
                const action = this.chain.action(Object.assign(this.param, accumulated), currentValue, index);
                if (action !== undefined) {
                    const context = new this.Context(this.chain.$chainId);
                    if (action instanceof Promise) {
                        action.then(props => {
                            this.propertyToContext(context, props);
                            new Reducer(this.array, this.param, this.chain
                                , this.Context, this.propertyToContext)
                                .reduce(done, context.getData(), ++index);
                        }).catch(err => done);
                    } else {
                        this.propertyToContext(context, action);
                        new Reducer(this.array, this.param, this.chain
                            , this.Context, this.propertyToContext)
                            .reduce(done, context.getData(), ++index);
                    }
                } else {
                    new Reducer(this.array, this.param, this.chain,
                        this.Context, this.propertyToContext)
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
export class Reducer {
    constructor(array, param, chain, Context, propertyToContext, contextInstance) {
        this.array = array;
        this.param = param;
        this.chain = chain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.context = contextInstance || Context.createContext(chain.$chainId);
    }

    reduce(done, accumulated = {}, index = 0) {
        setTimeout(() => {
            try {
                if (this.array && this.array.length > index) {
                    const currentValue = this.array[index];
                    const action = this.chain.action(Object.assign(this.param, accumulated), currentValue, index);
                    if (action !== undefined) {
                        if (action instanceof Promise) {
                            action.then(props => {
                                this.propertyToContext(this.context, props);
                                new Reducer(this.array, this.param, this.chain,
                                    this.Context, this.propertyToContext, this.context)
                                    .reduce(done, this.context.getData(), ++index);
                            }).catch(err => done);
                        } else {
                            this.propertyToContext(this.context, action);
                            new Reducer(this.array, this.param, this.chain, this.Context,
                                this.propertyToContext, this.context)
                                .reduce(done, this.context.getData(), ++index);
                        }
                    } else {
                        new Reducer(this.array, this.param, this.chain,
                            this.Context, this.propertyToContext, this.context)
                            .reduce(done, accumulated, ++index);
                    }
                } else {
                    done(undefined, accumulated);
                }
            } catch (err) {
                done(err);
            }
        });
    }
}
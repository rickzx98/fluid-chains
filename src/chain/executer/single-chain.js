export class SingleChain {
    constructor(getChain, Context, propertyToContext, Reducer, addChainToStack, stackId) {
        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
        this.addChainToStack = addChainToStack;
        this.stackId = stackId;
    }

    start(initialParam, chains) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const chain = this.getChain(chains);
                    this.addChainToStack(this.stackId, chain.$chainId);
                    const paramAsContext = new this.Context(initialParam.$chainId());
                    addSpecToContext(chain.specs, paramAsContext);
                    paramAsContext.runSpecs().then(() => {
                        const param = convertParamFromSpec(paramAsContext.getData(), chain);
                        onBeforeChain(chain, param, resolve, reject, this.Context, () => {
                            if (chain.reducer && param[chain.reducer]) {
                                const array = param[chain.reducer]();
                                new this.Reducer(array, param, chain,
                                    this.Context, this.propertyToContext)
                                    .reduce((err, result) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(result);
                                        }
                                    });
                            } else {
                                const action = chain.action(param);
                                const context = this.Context.createContext(chain.$chainId);
                                if (action !== undefined) {
                                    if (action instanceof Promise) {
                                        action.then(props => {
                                            this.propertyToContext(context, props);
                                            resolve(context.getData());
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    } else {
                                        this.propertyToContext(context, action);
                                        resolve(context.getData());
                                    }
                                } else {
                                    resolve(context.getData());
                                }
                            }
                        });

                    }).catch(err => {
                        reject(err);
                    });
                } catch (err) {
                    reject(err);
                }
            });
        });
    }
}
const onBeforeChain = (chain, param, resolve, reject, Context, next) => {
    try {
        const onbefore = chain.onbefore(param);
        if (onbefore instanceof Promise) {
            onbefore.then(con => {
                if (con) {
                    next();
                } else {
                    resolve(Context.createContext(chain.$chainId).getData());
                }
            }).catch(err => {
                reject(err);
            })
        } else if (onbefore) {
            next();
        } else {
            resolve(Context.createContext(chain.$chainId).getData());
        }
    } catch (err) {
        reject(err);
    }

}
const convertParamFromSpec = (param, chainInstance) => {
    let newParam = param;
    if (chainInstance.isStrict) {
        newParam = {};
        if (chainInstance.specs) {
            chainInstance.specs.forEach(spec => {
                newParam[spec.field] = param[spec.field];
            });
        }
    }
    return newParam;
};

const addSpecToContext = (specs, context) => {
    if (specs) {
        specs.forEach(spec => {
            context.addSpec(spec);
        });

    }
};
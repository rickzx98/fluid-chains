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
                const chain = this.getChain(chains);
                try {
                    this.addChainToStack(this.stackId, chain.$chainId);
                    const paramAsContext = new this.Context(initialParam.$chainId());
                    addSpecToContext(chain.specs, paramAsContext);
                    paramAsContext.runSpecs().then(() => {
                        const param = convertParamFromSpec(paramAsContext.getData(), chain);
                        onBeforeChain(chain, param, resolve, (err) => {
                            onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains);
                        }, this.Context, () => {
                            if (chain.reducer && param[chain.reducer]) {
                                const array = param[chain.reducer]();
                                new this.Reducer(array, param, chain,
                                    this.Context, this.propertyToContext)
                                    .reduce((err, result) => {
                                        if (err) {
                                            onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains);
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
                                            onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains);
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
                        onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains);
                    });
                } catch (err) {
                    onFailChain(chain, err, resolve.bind(this), reject.bind(this), this, initialParam, chains);
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
};

const onFailChain = (chain, error, resolve, reject, singleChain, initialParam, chains) => {
    if (chain.onfail) {
        chain.onfail(error, () => {
            singleChain.start(initialParam, chains)
                .then(result => { resolve(result); })
                .catch(err => { reject(err); });
        }, () => {
            reject(error);
        });
    } else {
        reject(error);
    }
};
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
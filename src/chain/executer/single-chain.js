export class SingleChain {
    constructor(getChain, Context, propertyToContext, Reducer) {
        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
    }

    start(initialParam, chains) {
        return new Promise((resolve, reject) => {
            try {
                const chain = this.getChain(chains);
                const param = convertParamFromSpec(initialParam, chain);
                const paramAsContext = new this.Context(initialParam.$chainId());
                addSpecToContext(chain.specs, paramAsContext);
                paramAsContext.runSpecs().then(() => {
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
                            resolve({});
                        }
                    }
                }).catch(err => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
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
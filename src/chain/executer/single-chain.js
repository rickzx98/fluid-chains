export class SingleChain {
    constructor(getChain, generateUUID, Context, propertyToContext, Reducer) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
    }

    start(initialParam, chains) {
        return new Promise((resolve, reject) => {
            try {
                const chain = this.getChain(chains);
                const param = convertParamFromSpec(initialParam, chain);
                const chainId = this.generateUUID();
                if (chain.reducer && param[chain.reducer]) {
                    const array = param[chain.reducer]();
                    new this.Reducer(array, param, chains, this.getChain, this.generateUUID, this.Context, this.propertyToContext)
                        .reduce((err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                } else {
                    const action = chain.action(param);
                    if (action !== undefined) {
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
                    } else {
                        resolve({});
                    }
                }
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
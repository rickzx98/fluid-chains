import Context from "../context/index";
import { generateUUID } from "../Util";
import { getChain } from "../storage/index";

export class Runner {
    constructor(getChain, generateUUID, Context) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
    }
    start(param, chains) {
        if (chains instanceof Array) {
            return executeArrayChains(param, this.getChain, this.generateUUID, this.Context, chains);
        } else {
            return executeSingleChain(param, chains, this.getChain, this.generateUUID, this.Context);
        }
    }
}

const executeSingleChain = (param, chains, getChain, generateUUID, Context) => {
    return new Promise((resolve, reject) => {
        try {
            const chain = getChain(chains);
            const chainId = generateUUID();
            const action = chain.action(param);
            if (action) {
                const context = new Context(chainId);
                if (action instanceof Promise) {
                    action.then(props => {
                        propertyToContext(context, props);
                        resolve(context.getData());
                    }).catch(err => reject);
                } else {
                    propertyToContext(context, action);
                    resolve(context.getData());
                }
            }
        } catch (err) {
            reject(err);
        }
    });
}

const executeArrayChains = (param, getChain, generateUUID, Context, array) => {
    return new Promise((resolve, reject) => {
        executeArrayChain(param, getChain, generateUUID, Context, array, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }, param);
    });
}

const executeArrayChain = (param, getChain, generateUUID, Context, array = [], done, defaultParam) => {
    const chain = array.shift();
    executeSingleChain(param, chain, getChain, generateUUID, Context)
        .then(result => {
            if (array.length) {
                executeArrayChain(Object.assign(defaultParam, result),
                    getChain,
                    generateUUID,
                    Context,
                    array,
                    done,
                    defaultParam);
            } else {
                done(undefined, result);
            }
        }).catch(err => done);

}
const propertyToContext = (context, chainReturn) => {
    if (chainReturn) {
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
}

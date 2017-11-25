import { getChain, putChain } from './storage/';

import Context from './context/';
import { generateUUID } from './Util';

export class Chain {
    constructor(name, action = (parameter) => { }) {
        this.action = action;
        putChain(name, this);
    }
}

export const execute = (param, chains) => {
    return new Promise((resolve, reject) => {
        if (chains instanceof Array) {

        } else {
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
        }
    });
}

const propertyToContext = (context, chainReturn) => {
    if (chainReturn) {
        for (let name in chainReturn) {
            if (chainReturn.hasOwnProperty(name)) {
                context.set(name, chainReturn[name]);
            }
        }
    }
}

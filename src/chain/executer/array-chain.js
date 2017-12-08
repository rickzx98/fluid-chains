export class ArrayChain {
    constructor(getChain, generateUUID, Context, singleChain) {
        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.singleChain = singleChain;
    }

    start(param, chains) {
        return executeArrayChains(param, this.getChain, this.generateUUID, this.Context, chains, this.singleChain);
    }
}


const executeArrayChains = (param, getChain, generateUUID, Context, array, singleChain) => {
    return new Promise((resolve, reject) => {
        executeArrayChain(param, getChain, generateUUID, Context, array, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }, param, singleChain);
    });
};

const executeArrayChain = (param, getChain, generateUUID, Context, array = [], done,
                           defaultParam, singleChain) => {
    const chain = array.shift();
    singleChain.start(param, chain)
        .then(result => {
            if (array.length) {
                const newParam = Object.assign(defaultParam, result);
                executeArrayChain(newParam,
                    getChain,
                    generateUUID,
                    Context,
                    array,
                    done,
                    defaultParam,
                    singleChain);
            } else {
                done(undefined, result);
            }
        }).catch(err => {
        done(err);
    });

};
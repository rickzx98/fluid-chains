import { ChainStorage } from './ChainStorage';
import { ConvertToContext } from './ContextFactory';
import lodash from 'lodash';

export const Execute = (name, param, done) => {
    let context = ConvertToContext(param);
    context.set('$owner', name + '_starter');
    if (name instanceof Array) {
        ExecuteChains(name, done, 0, context);
    } else if (lodash.get(ChainStorage, name)) {
        const chain = lodash.clone(lodash.get(ChainStorage, name)());
        chain.execute(done, context, name);
    } else {
        //TODO: RunMiddleware here
        throw new Error('Chain ' + name + ' does not exist.');
    }
};

function ExecuteChains(chains, done, index, originalParam, newParam) {
    if (index < chains.length) {
        //TODO: RunMiddleware here if chain does not exists
        const chain = lodash.clone(lodash.get(ChainStorage, chains[index])());
        const next = nextChain(chains, index);
        chain.execute(result => ExecuteChains(chains, done, ++index, originalParam, originalParam.merge(result)), newParam || originalParam, next, true);
    } else {
        done(newParam);
    }
}

function nextChain(chains, index) {
    const nextIndex = index + 1;
    if (chains.length > nextIndex) {
        return chains[nextIndex];
    }
    return undefined;
}

import { ChainStorage } from './ChainStorage';
import { ConvertToContext } from './ContextFactory';
import lodash from 'lodash';

export const Execute = (name, param, done) => {
    let context = ConvertToContext(param);
    context.set('$owner', name + '_starter');
    if (name instanceof Array) {
        ExecuteChains(name, done, 0, param);
    } else if (ChainStorage[name]) {
        const chain = lodash.clone(lodash.get(ChainStorage, name)());
        chain.execute(done, context, name);
    } else {
        throw new Error('Chain ' + name + ' does not exist.');
    }
};

function ExecuteChains(chains, done, index, param) {
    if (!index) {
        index = 0;
    }
    if (index < chains.length) {
        const chain = lodash.clone(lodash.get(ChainStorage, chains[index])());
        chain.execute((result) => {
            index++;
            ExecuteChains(chains, done, index, result);
        }, param, nextChain(chains, index), true);
    } else {
        done(param);
    }
}

function nextChain(chains, index) {
    const nextIndex = index + 1;
    if (chains.length > nextIndex) {
        return chains[nextIndex];
    }
}

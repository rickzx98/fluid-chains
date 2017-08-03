import {
  ChainStorage,
  exists
} from './ChainStorage';
import {
  ConvertToContext,
  CreateContext
} from './ContextFactory';

import ChainContext from './ChainContext';
import {
  RunMiddleware,
} from '../middleware/';
import lodash from 'lodash';

export const Execute = (name, param, done) => {
  let context = ConvertToContext(param);
  context.set('$owner', 'starter');
  if (name instanceof Array) {
    ExecuteChains(name, done, 0, context);
  } else if (lodash.get(ChainStorage, name)) {
    const chain = lodash.clone(lodash.get(ChainStorage, name)());
    chain.execute(done, context, name);
  } else {
    const cc = CreateContext(new ChainContext(), name);
    RunMiddleware(name, param, cc, err => {
      if (err) {
        throw err;
      }
      done(cc);
    });
  }
};

function handleError(context, err) {
  if (err) {
    context.set('$err', err);
    context.set('$errorMessage', err.message);
  }
}

function ExecuteChains(chains, done, index, originalParam, newParam) {
  if (index < chains.length) {
    if (exists(chains[index])) {
      const chain = lodash.clone(lodash.get(ChainStorage, chains[index])());
      const next = nextChain(chains, index);
      chain.execute(result => ExecuteChains(chains, done, ++index, originalParam, originalParam.merge(result)), newParam || originalParam, next, true);
    } else {
      const next = nextChain(chains, index);
      const context = CreateContext(new ChainContext(), chains[index], next);
      RunMiddleware(chains[index], newParam || originalParam, context, err => {
        if (err) {
          throw err;
        }
        ExecuteChains(chains, done, ++index, originalParam, originalParam.merge(context));
      });
    }

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
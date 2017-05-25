import {
  ChainStorage,
  putChain,
} from './ChainStorage';

import ChainContext from './ChainContext';
import {
  RunMiddleware,
} from './ChainMiddleware';
import lodash from 'lodash';
import sizeOf from 'object-sizeof';

const STATUS_IN_PROGRESS = 'IN_PROGRESS';
const STATUS_UNTOUCHED = 'UNTOUCHED';
const STATUS_DONE = 'DONE';
const STATUS_FAILED = 'FAILED';
const STATUS_TERMINATED = 'TERMINATED';


export class CH {

  constructor(name, action, next, error) {
    validate(name, action);
    let status = STATUS_UNTOUCHED;
    let context = new ChainContext();
    context.set('$owner', name);
    let responseTime = 0;
    this.spec = [];
    this.terminate = () => {
      context.set('$isTerminated', true);
    };
    this.execute = (done, pr, nxt, belt) => {
      context = CreateContext(context, name, belt ? nxt : next, error);
      const param = ConvertToContext(pr).clone();
      status = STATUS_IN_PROGRESS;
      RunMiddleware(param, (errMiddleware) => {
        if (errMiddleware) {
          done({
            $err: () => errMiddleware,
            $errorMessage: () => errMiddleware && errMiddleware.message
          });
        } else {
          if (param) {
            context.validate(param);
          }
          if ((param && param.$error) && !context.$error) {
            context.set('$error', param.$error());
          }
          if (context.$isTerminated && context.$isTerminated()) {
            status = STATUS_TERMINATED;
            const clonedContext = context.clone();
            done(clonedContext);
          } else {
            lodash.defer(() => {
              const startTime = new Date().getTime();
              try {
                action(context, param, err => {
                  if (err && err instanceof Error) {
                    failed(done, context, name, err);
                  } else {
                    status = STATUS_DONE;
                    if (context.$next && context.$next()) {
                      if (context.$isTerminated && context.$isTerminated()) {
                        status = STATUS_TERMINATED;
                        context.set('$responseTime', new Date().getTime() - startTime);
                        const clonedContext = context.clone();
                        done(clonedContext);
                      } else {
                        context.set('$responseTime', new Date().getTime() - startTime);
                        lodash.clone(ChainStorage[context.$next()]()).execute(done, context);
                      }
                    } else {
                      context.set('$responseTime', new Date().getTime() - startTime);
                      const clonedContext = context.clone();
                      done(clonedContext);
                    }
                  }
                });
              } catch (err) {
                context.set('$responseTime', new Date().getTime() - startTime);
                failed(done, context, name, err);
              }
            });
          }
        }
      }, nxt || next);
    };
    this.status = () => {
      return status;
    };
    this.info = () => {
      return {
        name: name,
        status: status,
        next: next,
        errorHandler: error,
        responseTime: context.$responseTime ? context.$responseTime() : 0
      }
    };
    this.addSpec = (field, required, customValidator) => {
      const spec = new ChainSpec(field, required, customValidator);
      this.spec.push(spec);
      context.addValidator(spec);
    }

    function failed(done, context, name, err) {
      status = STATUS_FAILED;
      if (context.$error) {
        lodash.clone(ChainStorage[context.$error()]()).execute(done, CreateErrorContext(context.$error(), name, err));
      } else {
        console.warn('UnhandledErrorCallback', err);
        done({
          $err: () => err,
          $errorMessage: () => err ? err.message : ''
        });
      }
    }
    putChain(name, this);
  }
  size() {
    return sizeOf(this);
  }

}

export const Execute = (name, param, done) => {
  if (!ChainStorage[name]) {
    throw new Error('Chain ' + name + ' does not exist.');
  }
  let context = ConvertToContext(param);
  context.set('$owner', name + '_starter');
  if (name instanceof Array) {
    ExecuteChains(name, done, index, param);
  } else if (ChainStorage[name]) {
    const chain = lodash.clone(lodash.get(ChainStorage, name)());
    chain.execute(done, context, name);
  }
};

function ExecuteChains(chains, done, index, param) {
  if (!index) {
    index = 0;
  }
  if (index < chains.length) {
    const chain = lodash.clone(lodash.get(ChainStorage, chains.shift())());
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

export class ChainSpec {
  constructor(field, required, customValidator, immutable) {
    if (customValidator && !(customValidator instanceof Function)) {
      throw new Error('customValidator must be a Function instance.');
    }
    this.field = field;
    this.required = required;
    this.validate = (context) => {
      if (required && (!context[field] || context[field]() === '')) {
        throw new Error('Field ' + field + ' is required.');
      }
      if (customValidator && context[field]) {
        customValidator(context[field](), (valid, message) => {
          if (!valid) {
            throw new Error(message || 'Validation failed for field ' + field);
          }
        });
      }
    }
    this.immutable = immutable;
  }
}
function validate(name, action) {
  if (!name) {
    throw new Error('Name is required.');
  }
  if (!action) {
    throw new Error('Action (Function) is required.');
  }
}
function CreateContext(original, name, next, error) {
  original.addValidator(new ChainSpec('$next', false, undefined, true));
  original.addValidator(new ChainSpec('$error', false, undefined, true));
  original.addValidator(new ChainSpec('$owner', false, undefined, true));
  const context = original.clone();
  if (error && !context.$error) {
    context.set('$error', error);
  }
  if (next && !context.$next) {
    context.set('$next', next);
  }
  return context;
}
function CreateErrorContext(name, errorFrom, err) {
  const context = new ChainContext();
  context.addValidator(new ChainSpec('$err', true, undefined, true));
  context.addValidator(new ChainSpec('$errorMessage', true, undefined, true));
  context.addValidator(new ChainSpec('$errorFrom', true, undefined, true));
  context.addValidator(new ChainSpec('$owner', true, undefined, true));
  context.addValidator(new ChainSpec('$responseTime', false, undefined, true));
  context.set('$owner', name);
  context.set('$err', err);
  context.set('$errorMessage', err.message);
  context.set('$errorFrom', errorFrom);
  return context;
}
function ConvertToContext(param) {
  if (!(param instanceof ChainContext)) {
    let context = new ChainContext();
    context.addValidator(new ChainSpec('$owner', false, undefined, true));
    if (param) {
      lodash.forIn(param, (val, key) => {
        context.addValidator(new ChainSpec(key, false, undefined, true));
        if (val instanceof Function) {
          throw new Error('Param must not contain functions');
        }
        context.set(key, val);
      });
    }
    return context;
  }
  return param;
}
import {
  ChainStorage,
  getConfig,
  putChain,
} from './ChainStorage';
import { ConvertToContext, CreateContext, CreateErrorContext } from './ContextFactory';
import { STATUS_DONE, STATUS_FAILED, STATUS_IN_PROGRESS, STATUS_TERMINATED, STATUS_UNTOUCHED } from './ChainStatus.js';

import ChainContext from './ChainContext';
import ChainSpec from './ChainSpec';
import {
  RunMiddleware,
} from './ChainMiddleware';
import { ValidateConstructor } from './Validation';
import lodash from 'lodash';
import sizeOf from 'object-sizeof';

export class CH {
  constructor(name, action, next, error) {
    ValidateConstructor(name, action);
    let status = STATUS_UNTOUCHED;
    let context = new ChainContext();
    context.set('$owner', name);
    this.spec = [];
    this.terminate = () => {
      context.set('$isTerminated', true);
    };
    this.execute = (done, pr, nxt, belt) => {
      context = CreateContext(context, name, belt ? nxt : next, error);
      const param = !!getConfig()['$strict'] ? ConvertToContext(pr).cloneFor(context) : ConvertToContext(pr).clone();
      status = STATUS_IN_PROGRESS;
      RunMiddleware(param, (errMiddleware) => {
        if (errMiddleware) {
          done({
            $err: () => errMiddleware,
            $errorMessage: () => errMiddleware && errMiddleware.message
          });
        } else {
          context.validate(param);
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
                    if (belt && nxt) {
                      context.set('$responseTime', new Date().getTime() - startTime);
                      lodash.clone(ChainStorage[nxt]()).execute(done, context);
                    } else if (!belt && (context.$next && context.$next())) {
                      if (context.$isTerminated && context.$isTerminated()) {
                        status = STATUS_TERMINATED;
                        ChainResponse(done, context, startTime);
                      } else {
                        context.set('$responseTime', new Date().getTime() - startTime);
                        lodash.clone(ChainStorage[context.$next()]()).execute(done, context);
                      }
                    } else {
                      ChainResponse(done, context, startTime);
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
      }, belt ? nxt : nxt || next);
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
    };
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

const ChainResponse = (done, context, startTime) => {
  context.set('$responseTime', new Date().getTime() - startTime);
  const clonedContext = context.clone();
  done(clonedContext);
}
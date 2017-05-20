import ChainContext from './ChainContext';
import { putChain, ChainStorage } from './ChainStorage';
import lodash from 'lodash';
const STATUS_IN_PROGRESS = 'IN_PROGRESS';
const STATUS_UNTOUCHED = 'UNTOUCHED';
const STATUS_DONE = 'DONE';
const STATUS_FAILED = 'FAILED';
const STATUS_TERMINATED = 'TERMINATED';

export default class Chain {

    constructor(name, action, next, error) {
        validate(action);
        let status = STATUS_UNTOUCHED;
        const context = new ChainContext(name);
        if (error) {
            context.set('$error', error);
        }
        putChain(name, this);
        this.terminate = ()=> {
            context.set('$isTerminated', true);
        };
        this.execute = (done, param)=> {
            status = STATUS_IN_PROGRESS;
            if ((param && param.$error) && !context.$error) {
                context.set('$error', param.$error());
            }
            if (context.$isTerminated && context.$isTerminated()) {
                status = STATUS_TERMINATED;
                done(context);
            } else {
                lodash.defer(() => {
                    try {
                        action(context, param, () => {
                            if (next) {
                                ChainStorage[next]().execute(done, context);
                            } else {
                                done(context);
                            }
                            status = STATUS_DONE;
                        });
                    } catch (err) {
                        status = STATUS_FAILED;
                        if (context.$error) {
                            context.set('$errorMessage', err);
                            context.set('$name', name);
                            ChainStorage[context.$error()]().execute(done, context);
                        } else {
                            done({
                                $error: ()=>err
                            });
                        }
                    }
                });
            }
        };
        this.status = ()=> {
            return status;
        };
        this.info = ()=> {
            return {
                name: name,
                status: status,
                next: next,
                errorHandler: error
            }
        };
    }

}

function validate(action) {
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
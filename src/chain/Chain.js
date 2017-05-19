import ChainContext from './ChainContext';
import { putChain, ChainStorage } from './ChainStorage';

export default class Chain {
    constructor(name, action, next, error) {
        validate(action);
        this.name = name;
        this.action = action;
        this.next = next;
        this.context = new ChainContext(name);
        if (error) {
            this.context.set('$error', error);
        }
        putChain(name, this);
    }

    execute(done, param) {
        if ((param && param.$error) && !this.context.$error) {
            this.context.set('$error', param.$error());
        }
        if (this.context.$isTerminated && this.context.$isTerminated()) {
            done(this.context);
        } else {
            setTimeout(() => {
                try {
                    this.action(this.context, param, () => {
                        if (this.next) {
                            ChainStorage[this.next]().execute(done, this.context);
                        } else {
                            done(this.context);
                        }
                    });
                } catch (err) {
                    if (this.context.$error) {
                        this.context.set('$errorMessage', err);
                        this.context.set('$name', this.name);
                        ChainStorage[this.context.$error()]().execute(done, this.context);
                    } else {
                        throw err;
                    }
                }
            });
        }
    }

    terminate() {
        this.context.set('$isTerminated', true);
    }
}

function validate(action) {
    if (!action) {
        throw new Error('Action (Function) is required.');
    }
}
import Context from './context/';
import { Executer } from './executer/';
import Spec from './spec/';
import { generateUUID } from './Util';
import { putChain } from './storage/';

export class Chain {
    constructor(name, action = (parameter) => { }, sequence = []) {
        this.action = action;
        this.specs = [];
        this.onbefore = () => true;
        this.sequence = sequence || [];
        if (!this.sequence.length) {
            this.sequence.push(name);
        }
        putChain(name, this);
    }
    static start(chains, param = {}) {
        return new Executer().start(param, chains);
    }
    static create(name) {
        return new Chain(name);
    }
    connect(name) {
        this.sequence.push(name);
        return new Chain(name, () => { }, this.sequence);
    }
    reduce(field) {
        this.reducer = field;
        return this;
    }
    spec(field, json) {
        const spec = new Spec(field);
        if (json.require) {
            spec.require(json.requireMessage);
        }
        if (json.default) {
            spec.default(json.default);
        }
        if (json.validate) {
            spec.validate(json.validate);
        }
        if (json.transform) {
            spec.transform(json.transform);
        }
        if (json.translate) {
            spec.translate(json.translate);
        }
        this.specs.push(spec);
        return this;
    }
    strict() {
        this.isStrict = true;
        return this;
    }
    onStart(action) {
        this.action = action;
        return this;
    }
    onBefore(onbefore) {
        this.onbefore = onbefore;
        return this;
    }
    onFail(onFail) {
        this.onfail = onFail;
        return this;
    };

    execute(param) {
        return Chain.start(this.sequence || this.name, param);
    }
}
import Context from './context/';
import { Executer } from './executer/';
import Spec from './spec/';
import { generateUUID } from './Util';
import { putChain } from './storage/';

export class Chain {
    constructor(name, action = (parameter) => { }) {
        this.action = action;
        this.specs = [];
        this.onStart = () => true;
        this.onComplete = () => { };
        this.onFail = () => { };
        putChain(name, this);
    }
    static start(chains, param = {}) {
        return new Executer().start(param, chains);
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
    onStart(onStart) {
        console.log('setOnstart', onStart);
        this.onStart = onStart;
        return this;
    }
    onComplete(onComplete) {
        this.onComplete = onComplete;
        return this;
    }
    onFail(onFail) {
        this.onFail = onFail;
        return this;
    };
}
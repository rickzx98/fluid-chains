import Context from './context/';
import { Executer } from './executer/';
import { generateUUID } from './Util';
import { putChain } from './storage/';

export class Chain {
    constructor(name, action = (parameter) => { }) {
        this.action = action;
        putChain(name, this);
    }
    static start(chains, param = {}) {
        return new Executer().start(param, chains);
    }
    reduce(field) {
        this.reducer = field;
        return this;
    }
}
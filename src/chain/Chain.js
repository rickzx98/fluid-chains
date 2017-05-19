import ChainContext from './ChainContext';
import { ChainStorage } from './ChainStorage';

export default class Chain {
    constructor(name, action, next, error) {
        validate(action);
        this.next = next;
        this.context = new ChainContext(name);
    }
}

function validate(action) {
    if (!action) {
        throw new Error('Should action (Function) to Chain constructor.');
    }
}
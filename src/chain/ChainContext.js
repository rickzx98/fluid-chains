import lodash from 'lodash';

export default class ChainContext {
    constructor(name) {
        set('owner', name);
    }
    set(name, value) {
        lodash.set(this, name, () => value);
    }
}
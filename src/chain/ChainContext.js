import lodash from 'lodash';

export default class ChainContext {
    constructor(name) {
        if(!name){
            throw new Error('Owner name is required.');
        }
        this.set('$owner', name);
    }
    set(name, value) {
        lodash.set(this, name, () => lodash.clone(value));
    }
}
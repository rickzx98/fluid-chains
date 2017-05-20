import lodash from 'lodash';

export default class ChainContext {
    constructor(name) {
        if(!name){
            throw new Error('Owner name is required.');
        }
        this.set('$owner', name);
    }
    set(name, value) {
        if(value instanceof Function){
            throw new Error('Function cannot be set as value');
        }
        lodash.set(this, name, () => lodash.clone(value));
    }
    spec(data){

    }
    validate(){

    }

}
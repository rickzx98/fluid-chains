import { Chain } from 'fluid-chains';

export default class SayHelloWorld extends Chain {
    constructor() {
        super('SayHelloWorld', (context, param, next) => {
            if (param.name) {
                console.log('hello ', param.name());
            } else {
                console.log('hello world');
            }
            next();
        });
    }
}
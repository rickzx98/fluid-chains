import { Chain } from 'fluid-chains';

export default class SayHelloWorldErrorHandler extends Chain {
    constructor() {
        super('SayHelloWorldErrorHandler', (context, param, next) => {
            console.log('An error has occured in chain ' + param.$name() + '. Error message: ' + param.$errorMessage());
            next();
        });
    }
}
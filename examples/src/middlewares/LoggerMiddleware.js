import { ChainMiddleware } from 'fluid-chains';

export default class LoggerMiddleware extends ChainMiddleware {
    constructor() {
        super('LoggerMiddleware', (param, nextChain, next) => {  
            console.log('from chain', param.$owner());
            console.log('next chain', nextChain);
            next();
        });
    }
}
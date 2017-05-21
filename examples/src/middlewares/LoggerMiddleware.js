import { ChainMiddleware } from 'fluid-chains';

export default class LoggerMiddleware extends ChainMiddleware {
    constructor() {
        super('LoggerMiddleware', (param, next) => {
            console.log('on chain', param.$owner());
            next();
        });
    }
}
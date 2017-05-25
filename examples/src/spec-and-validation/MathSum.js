import { Chain } from 'fluid-chains';

export default class MathSum extends Chain {
    constructor() {
        super('MathSum', (context, param, done) => {
            context.set('sum', param.firstNumber() + param.secondNumber());
            done();
        });
        this.addSpec('firstNumber', true, undefined, true);
        this.addSpec('secondNumber', true, undefined, true);
    }
}
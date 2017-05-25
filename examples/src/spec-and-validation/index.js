import { ExecuteChain } from 'fluid-chains';
import MathSum from './MathSum';

new MathSum();


ExecuteChain('MathSum', {
    firstNumber: 1
}, (result) => {
    if (result.$err) {
        console.log(result.$err());
    } else if (result.sum) {
        console.log('sum', result.sum());
    }
})

ExecuteChain('MathSum', {
    firstNumber: 1,
    secondNumber: 5
}, (result) => {
    if (result.$err) {
        console.log(result.$err());
    } else if (result.sum) {
        console.log('sum', result.sum());
    }
})

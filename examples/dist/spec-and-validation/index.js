'use strict';

var _fluidChains = require('fluid-chains');

var _MathSum = require('./MathSum');

var _MathSum2 = _interopRequireDefault(_MathSum);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _MathSum2.default();

(0, _fluidChains.ExecuteChain)('MathSum', {
    firstNumber: 1
}, function (result) {
    if (result.$err) {
        console.log(result.$err());
    } else if (result.sum) {
        console.log('sum', result.sum());
    }
});

(0, _fluidChains.ExecuteChain)('MathSum', {
    firstNumber: 1,
    secondNumber: 5
}, function (result) {
    if (result.$err) {
        console.log(result.$err());
    } else if (result.sum) {
        console.log('sum', result.sum());
    }
});
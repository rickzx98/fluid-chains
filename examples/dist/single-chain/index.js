'use strict';

var _fluidChains = require('fluid-chains');

var _SayHelloWorld = require('./SayHelloWorld');

var _SayHelloWorld2 = _interopRequireDefault(_SayHelloWorld);

var _SayHelloWorldErrorHandler = require('./SayHelloWorldErrorHandler');

var _SayHelloWorldErrorHandler2 = _interopRequireDefault(_SayHelloWorldErrorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _SayHelloWorld2.default();
new _SayHelloWorldErrorHandler2.default();

(0, _fluidChains.ExecuteChain)('SayHelloWorld', {}, function () {
    console.log('executed without a name.');
});

(0, _fluidChains.ExecuteChain)('SayHelloWorld', { name: 'Jerico' }, function () {
    console.log('executed with a name.');
});

(0, _fluidChains.ExecuteChain)('SayHelloWorld', { name: 'fail' }, function () {
    console.log('executed with a name.');
});
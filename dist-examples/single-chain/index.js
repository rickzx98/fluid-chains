'use strict';

var _src = require('../../src/');

var _SayHelloWorld = require('./SayHelloWorld');

var _SayHelloWorld2 = _interopRequireDefault(_SayHelloWorld);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _src.ExecuteChain)('SayHelloWorld', {}, function () {
    console.log('executed without a name.');
});

(0, _src.ExecuteChain)('SayHelloWorld', { name: 'Jerico' }, function () {
    console.log('executed with a name.');
});
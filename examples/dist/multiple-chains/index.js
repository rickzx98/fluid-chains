'use strict';

var _fluidChains = require('fluid-chains');

var _FindPeople = require('./FindPeople');

var _FindPeople2 = _interopRequireDefault(_FindPeople);

var _FindSoftwareEngineers = require('./FindSoftwareEngineers');

var _FindSoftwareEngineers2 = _interopRequireDefault(_FindSoftwareEngineers);

var _LoggerMiddleware = require('../middlewares/LoggerMiddleware');

var _LoggerMiddleware2 = _interopRequireDefault(_LoggerMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _FindPeople2.default();
new _FindSoftwareEngineers2.default();
new _LoggerMiddleware2.default();

(0, _fluidChains.ExecuteChain)('FindPeople', {}, function (result) {
    var softwareEngineers = result.softwareEngineers();
    console.log('softwareEngineers', softwareEngineers);
});
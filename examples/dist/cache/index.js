'use strict';

var _fluidChains = require('fluid-chains');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _v8Profiler = require('v8-profiler');

var _v8Profiler2 = _interopRequireDefault(_v8Profiler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _fluidChains.Chain('$001', function (context, param, next) {
    console.log('context.$owner()', context.$owner());
    for (var i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(function () {
        next();
    }, 800);
}, '$002');
new _fluidChains.Chain('$002', function (context, param, next) {
    console.log('context.$owner()', context.$owner());
    for (var i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(function () {
        next();
    }, 800);
}, '$003');

new _fluidChains.Chain('$003', function (context, param, next) {
    console.log('context.$owner()', context.$owner());
    for (var i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(function () {
        next();
    }, 800);
}, '$004');

new _fluidChains.Chain('$004', function (context, param, next) {
    console.log('context.$owner()', context.$owner());
    for (var i = 0; i < 800; i++) {
        context.set('$' + i, 'hello');
    }
    setTimeout(function () {
        next();
    }, 800);
});

(0, _fluidChains.ExecuteChain)('$001', {}, function () {
    var snapshot = _v8Profiler2.default.takeSnapshot();
    snapshot.export().pipe(_fs2.default.createWriteStream('snapshot.heapsnapshot'));
});
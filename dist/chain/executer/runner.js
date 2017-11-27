'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Runner = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _arrayChain = require('./array-chain');

var _index = require('../context/index');

var _index2 = _interopRequireDefault(_index);

var _singleChain = require('./single-chain');

var _Util = require('../Util');

var _index3 = require('../storage/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Runner = exports.Runner = function () {
    function Runner(getChain, generateUUID, Context) {
        _classCallCheck(this, Runner);

        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
    }

    _createClass(Runner, [{
        key: 'start',
        value: function start(param, chains) {
            if (chains instanceof Array) {
                return new _arrayChain.ArrayChain(this.getChain, this.generateUUID, this.Context, new _singleChain.SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext)).start(param, chains);
            } else {
                return new _singleChain.SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext).start(param, chains);
            }
        }
    }]);

    return Runner;
}();

var propertyToContext = function propertyToContext(context, chainReturn) {
    if (chainReturn) {
        if (chainReturn instanceof Object) {
            for (var name in chainReturn) {
                if (chainReturn.hasOwnProperty(name)) {
                    context.set(name, chainReturn[name]);
                }
            }
        } else {
            context.set('value', chainReturn);
        }
    }
};
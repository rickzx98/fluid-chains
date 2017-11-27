'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Runner = exports.Runner = function () {
    function Runner(getChain, generateUUID, Context, SingleChain, ArrayChain) {
        _classCallCheck(this, Runner);

        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.SingleChain = SingleChain;
        this.ArrayChain = ArrayChain;
    }

    _createClass(Runner, [{
        key: 'start',
        value: function start(param, chains) {
            if (chains instanceof Array) {
                return new this.ArrayChain(this.getChain, this.generateUUID, this.Context, new this.SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext)).start(param, chains);
            } else {
                return new this.SingleChain(this.getChain, this.generateUUID, this.Context, propertyToContext).start(param, chains);
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
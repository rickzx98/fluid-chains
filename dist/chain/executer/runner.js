'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Runner = exports.Runner = function () {
    function Runner(getChain, generateUUID, Context, SingleChain, ArrayChain, Reducer, Util, createExecutionStack, addChainToStack, deleteStack) {
        _classCallCheck(this, Runner);

        this.getChain = getChain;
        this.generateUUID = generateUUID;
        this.Context = Context;
        this.SingleChain = SingleChain;
        this.ArrayChain = ArrayChain;
        this.Reducer = Reducer;
        this.Util = Util;
        this.createExecutionStack = createExecutionStack;
        this.addChainToStack = addChainToStack;
        this.deleteStack = deleteStack;
    }

    _createClass(Runner, [{
        key: 'start',
        value: function start(param, chains) {
            var _this = this;

            var newParam = this.Util.convertToContextStructure(param, this.Context, this.generateUUID);
            var stackId = this.createExecutionStack();
            this.addChainToStack(stackId, newParam.$chainId());
            if (chains instanceof Array) {
                return new this.ArrayChain(this.getChain, this.generateUUID, this.Context, new this.SingleChain(this.getChain, this.Context, propertyToContext, this.Reducer, this.addChainToStack, stackId)).start(newParam, chains).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        try {
                            _this.deleteStack(stackId);
                            resolve(result);
                        } catch (err) {
                            reject(err);
                        }
                    });
                }).catch(function (error) {
                    return new Promise(function (resolve, reject) {
                        try {
                            _this.deleteStack(stackId);
                            reject({
                                stackId: stackId,
                                error: error
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            } else {
                return new this.SingleChain(this.getChain, this.Context, propertyToContext, this.Reducer, this.addChainToStack, stackId).start(newParam, chains).then(function (result) {
                    return new Promise(function (resolve, reject) {
                        try {
                            _this.deleteStack(stackId);
                            resolve(result);
                        } catch (err) {
                            reject(err);
                        }
                    });
                }).catch(function (error) {
                    return new Promise(function (resolve, reject) {
                        try {
                            _this.deleteStack(stackId);
                            reject({
                                stackId: stackId,
                                error: error
                            });
                        } catch (err) {
                            reject(err);
                        }
                    });
                });
            }
        }
    }]);

    return Runner;
}();

var propertyToContext = function propertyToContext(context, chainReturn) {
    if (chainReturn !== undefined) {
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
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SingleChain = exports.SingleChain = function () {
    function SingleChain(getChain, Context, propertyToContext, Reducer, addChainToStack, stackId) {
        _classCallCheck(this, SingleChain);

        this.getChain = getChain;
        this.Context = Context;
        this.propertyToContext = propertyToContext;
        this.Reducer = Reducer;
        this.addChainToStack = addChainToStack;
        this.stackId = stackId;
    }

    _createClass(SingleChain, [{
        key: "start",
        value: function start(initialParam, chains) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                try {
                    var chain = _this.getChain(chains);
                    _this.addChainToStack(_this.stackId, chain.$chainId);
                    var param = convertParamFromSpec(initialParam, chain);
                    var paramAsContext = new _this.Context(initialParam.$chainId());
                    addSpecToContext(chain.specs, paramAsContext);
                    paramAsContext.runSpecs().then(function () {
                        if (chain.reducer && param[chain.reducer]) {
                            var array = param[chain.reducer]();
                            new _this.Reducer(array, param, chain, _this.Context, _this.propertyToContext).reduce(function (err, result) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        } else {
                            var action = chain.action(param);
                            var context = _this.Context.createContext(chain.$chainId);
                            if (action !== undefined) {
                                if (action instanceof Promise) {
                                    action.then(function (props) {
                                        _this.propertyToContext(context, props);
                                        resolve(context.getData());
                                    }).catch(function (err) {
                                        reject(err);
                                    });
                                } else {
                                    _this.propertyToContext(context, action);
                                    resolve(context.getData());
                                }
                            } else {
                                resolve({});
                            }
                        }
                    }).catch(function (err) {
                        reject(err);
                    });
                } catch (err) {
                    reject(err);
                }
            });
        }
    }]);

    return SingleChain;
}();

var convertParamFromSpec = function convertParamFromSpec(param, chainInstance) {
    var newParam = param;
    if (chainInstance.isStrict) {
        newParam = {};
        if (chainInstance.specs) {
            chainInstance.specs.forEach(function (spec) {
                newParam[spec.field] = param[spec.field];
            });
        }
    }
    return newParam;
};

var addSpecToContext = function addSpecToContext(specs, context) {
    if (specs) {
        specs.forEach(function (spec) {
            context.addSpec(spec);
        });
    }
};